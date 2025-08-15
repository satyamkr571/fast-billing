import express from "express";
import pkg from "body-parser";
const { json } = pkg;
import authRoutes from "./routes/auth.js";
import { connect } from "mongoose";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api", authRoutes);
const PORT = 8080;

connect(
  "mongodb+srv://satyamDB:satyam@cluster0.teswf.gcp.mongodb.net/fast_billing"
)
  .then(() => {
    console.log("MongoDB connected successfully 🚀🚀");
  })
  .catch((err) => console.error("MongoDB connection error:", err))
  .finally(() =>
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀🚀🚀`);
    })
  );
