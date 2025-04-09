import cookieParser from "cookie-parser";
import express from "express";
import "dotenv/config";

import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";

const app = express();

const port = process.env.PORT || 4000;
await connectDB();

//Allow Multiple origin
const allowedOrigins = ["http://localhost:5173"];

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, Credentials: true }));

app.get("/", (req, res) => res.send("api working"));
app.use('/api/user',userRouter)

app.listen(port, () => {
  console.log(`server is http://localhost:${port}`);
});

