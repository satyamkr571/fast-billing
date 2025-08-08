// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  mobile: { type: String, unique: true },
  password: { type: String }, // Can be null for OTP logins
});

const User = mongoose.model("User", userSchema);

// Export database functions
export const createUser = (data) => User.create(data);
export const findOneUser = (filter) => User.findOne(filter);
