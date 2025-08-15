import express from "express";
import authRoutes from "./routes/auth.js";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api", authRoutes);
const PORT = process.env.PORT || 8080;

connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully 🚀🚀");
  })
  .catch((err) => console.error("MongoDB connection error:", err))
  .finally(() =>
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀🚀🚀`);
    })
  );
