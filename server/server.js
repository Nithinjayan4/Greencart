import cookieParser from "cookie-parser";
import express from "express";
import "dotenv/config";

import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/adressRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

const port = process.env.PORT || 4000;
await connectDB();

await connectCloudinary()

//Allow Multiple origin
const allowedOrigins = ["http://localhost:5173"];

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, Credentials: true }));

app.get("/", (req, res) => res.send("api working"));
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);



app.listen(port, () => {
  console.log(`server is http://localhost:${port}`);
});
