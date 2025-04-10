//place order cod :

import { request, response } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid Data" });
    }

    // Calculate total price
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add tax charge (2%)
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "COD",
    });

    return res
      .status(201)
      .json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PLACE ORDER ONLINE(STRIPE) : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid Data" });
    }

    let ProductData = [];

    // Calculate total price
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      ProductData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add tax charge (2%)
    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "Online",
    });

    // Create a checkout session for Stripe

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KET);

    //create line items for stripe

    const line_items = ProductData.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });

    // Create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=/my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//stripe webhook : /stripe

export const stripeWebhook = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KET);
  const sig = request.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    response.status(400).send(`webhook error: ${error.message}`);
  }
  // Handle the event

  switch (event.type) {
    case "payment_intent.succeeded":
      {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        //getting sesseion metadata

        const session = await stripeInstance.checkout.sessions.list({
          paymentIntent: paymentIntentId,
        });

        const {orderId, userId } = session.data[0].metadata;

        // mark payment  as paid 

        await Order.findByIdAndUpdate(orderId, { isPaid: true });

        //clear user cart

        await User.findByIdAndUpdate(userId, { cartItems: {} });
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        //getting sesseion metadata

        const session = await stripeInstance.checkout.sessions.list({
          paymentIntent: paymentIntentId,
        });

        const {orderId} = session.data[0].metadata;
        await Order.findByIdAndDelete(orderId);
        break;

      }

     
    default:
      console.error(`Unhandled event type: ${event.type}`);
      break;
  }
  response.json({ received: true });
};

//get order by user ID : GET /api/order/user

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.query.userId || req.user._id; // Use query parameter or authenticated user ID

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// get all orders for seller/admin : /api/order/seller

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product address");
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
