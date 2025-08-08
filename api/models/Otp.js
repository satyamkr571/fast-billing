// models/Otp.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  mobile: String,
  otp: String,
  expiresAt: Date,
});

const Otp = mongoose.model("Otp", otpSchema);

export const createOtp = (data) => Otp.create(data);
export const deleteOtp = (filter) => Otp.deleteMany(filter);
export const findOneOtp = (filter) => Otp.findOne(filter);
