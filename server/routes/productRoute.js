import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middleware/authSeller.js";
import {
  addProduct,
  changeStoke,
  productBuId,
  productList,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array(["images"]), authSeller, addProduct);
productRouter.get("/list", productList);
productRouter.get("/id", productBuId);
productRouter.post("/stock", authSeller, changeStoke);

export default productRouter;
