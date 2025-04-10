



// update  user cart data  : PUT /api/cart/ update

import User from "../models/User.js";

export const  updateCart = async (req, res) => {
    try{

        const {userId, cartItems} = req.body;

        await User.findAndUpdate(userId, {cartItems} )
        return res.json({ success: true, message: "Cart updated successfully" });

    }catch(error){
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }

}