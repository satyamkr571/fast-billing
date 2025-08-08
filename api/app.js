import express from "express";
import pkg from "body-parser";
const { json } = pkg;
import authRoutes from "./routes/auth.js";
import { connect } from "mongoose";

const app = express();
app.use(json());

app.use("/auth", authRoutes);

connect("your-mongodb-uri", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
