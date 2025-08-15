// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  mobile: { type: String, unique: true, required: true, unique: true },
  password: { type: String, required: true }, // Can be null for OTP logins
  supplierName: { type: String, required: true },
  supplierAddress: { type: String, required: true },
  GSTIn: { type: String, required: true, unique: true },
  bank: { type: String, required: true },
  accountName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifsc: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Export database functions
export const createUser = (data) => User.create(data);
export const findOneUser = (filter) => User.findOne(filter);
export const updateUser = (id, data) => User.updateOne(id, data);
