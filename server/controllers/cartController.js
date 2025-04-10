



// update  user cart data  : PUT /api/cart/ get

import User from "../models/User.js";

export const updateCart = async (req, res) => {
    try {
      console.log(req.body);
      const { userId, cartItems } = req.body;
  
      await User.findByIdAndUpdate(userId, { cartItems }, { new: true });
  
      return res.json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  