import { Router } from "express";
import { deleteOtp, createOtp, findOneOtp } from "../models/Otp.js";
import { createUser, findOneUser, updateUser } from "../models/User.js";
import { generateOtp } from "../services/otpService.js";

const router = Router();

/**
 * 🆕 Create a new user
 */
router.post("/create-user", async (req, res) => {
  try {
    const {
      username,
      mobile,
      password,
      supplierName,
      supplierAddress,
      GSTIn,
      bank,
      accountName,
      accountNumber,
      ifsc,
    } = req.body;

    // Check if username already exists
    const existingUser = await findOneUser({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create user
    const newUser = await createUser({
      username,
      mobile,
      password,
      supplierName,
      supplierAddress,
      GSTIn,
      bank,
      accountName,
      accountNumber,
      ifsc,
    });

    // Remove password before sending back
    const { password: _, ...safeUser } = newUser.toObject
      ? newUser.toObject()
      : newUser;

    res.status(201).json({
      message: "User created successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * 📝 Update user details
 */
router.post("/updateUser", async (req, res) => {
  const { username, GSTIn, bank, accountName, accountNumber, ifsc } = req.body;

  const user = await findOneUser({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = await updateUser(
    { username }, // filter
    { GSTIn, bank, accountName, accountNumber, ifsc } // update
  );

  return res.json({ message: "User updated successfully", updatedUser });
});

/**
 * 🔐 Login with username/password
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await findOneUser({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Remove password before sending
  const { password: _, ...safeUser } = user.toObject ? user.toObject() : user;

  return res.json({
    message: "Login was successful",
    user: safeUser,
  });
});

/**
 * 📲 Send OTP to mobile
 */
router.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;
  const otp = generateOtp();

  await deleteOtp({ mobile });
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins

  await createOtp({ mobile, otp, expiresAt });

  console.log(`Sending OTP to ${mobile}: ${otp}`); // In production, send via SMS

  res.json({ message: "OTP sent" });
});

/**
 * ✅ Verify OTP and login
 */
router.post("/verify-otp", async (req, res) => {
  const { mobile, otp } = req.body;

  const record = await findOneOtp({ mobile, otp });
  if (!record || record.expiresAt < new Date()) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  await deleteOtp({ mobile }); // Fixed: was deleteMany before

  let user = await findOneUser({ mobile });
  if (!user) {
    user = await createUser({ username: mobile, mobile, password: null });
  }

  // Remove password before sending
  const { password: _, ...safeUser } = user.toObject ? user.toObject() : user;

  res.json({
    message: "OTP verified, login successful",
    user: safeUser,
  });
});

export default router;
