import { Router } from "express";
import { deleteOtp, createOtp, findOneOtp } from "../models/Otp.js";
import { createUser, findOneUser } from "../models/User.js";
import { generateOtp, verifyOtp } from "../services/otpService.js";

const router = Router();

// 🔐 Login with username/password
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await createUser({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", username });
});

// 📲 Send OTP to mobile
router.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;
  const otp = generateOtp();

  await deleteOtp({ mobile });
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins

  await createOtp({ mobile, otp, expiresAt });

  console.log(`Sending OTP to ${mobile}: ${otp}`); // In production, send via SMS

  res.json({ message: "OTP sent" });
});

// ✅ Verify OTP and login
router.post("/verify-otp", async (req, res) => {
  const { mobile, otp } = req.body;

  const record = await findOneOtp({ mobile, otp });
  if (!record || record.expiresAt < new Date()) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  await deleteMany({ mobile });

  let user = await findOneUser({ mobile });
  if (!user) {
    user = await createUser({ username: mobile, mobile, password: null });
  }

  res.json({ message: "OTP verified, login successful", userId: user._id });
});

export default router;
