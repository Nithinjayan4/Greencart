//add address : /api/address/add

import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;

    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//get address : /api/address/list

export const getAddress= async (req, res) => {
  try {
      const { userId } = req.query;
    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
