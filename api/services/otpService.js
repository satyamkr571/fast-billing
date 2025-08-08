// services/otpService.js

import generateOtpCode from "../utils/generateOtpCode.js";

const otpStore = new Map(); // mobile => { otp, expiresAt }

export function generateOtp(mobile) {
  const otp = generateOtpCode();
  const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes

  otpStore.set(mobile, { otp, expiresAt });
  return otp;
}

export function verifyOtp(mobile, otp) {
  const record = otpStore.get(mobile);

  if (!record) return false;
  if (record.otp !== otp) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(mobile);
    return false;
  }

  otpStore.delete(mobile); // OTP is single-use
  return true;
}
