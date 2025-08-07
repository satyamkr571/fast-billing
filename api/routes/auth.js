const express = require("express");
const User = require("../models/User");
const Otp = require("../models/Otp");
const generateOtp = require("../utils/generateOtp");

const express = require("express");
const router = express.Router();
const otpService = require("../services/otpService");

// 🔐 Login with username/password

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", username });
});

// 📲 Send OTP to mobile

router.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;
  const otp = generateOtp();

  await Otp.deleteMany({ mobile }); // remove old ones
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins

  await Otp.create({ mobile, otp, expiresAt });

  console.log(`Sending OTP to ${mobile}: ${otp}`); // In production, send via SMS

  res.json({ message: "OTP sent" });
});

// ✅ Verify OTP and login

router.post("/verify-otp", async (req, res) => {
  const { mobile, otp } = req.body;

  const record = await Otp.findOne({ mobile, otp });
  if (!record || record.expiresAt < new Date()) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  await Otp.deleteMany({ mobile }); // clean up

  let user = await User.findOne({ mobile });
  if (!user) {
    user = await User.create({ username: mobile, mobile, password: null }); // guest login
  }

  res.json({ message: "OTP verified, login successful", userId: user._id });
});

module.exports = router;
