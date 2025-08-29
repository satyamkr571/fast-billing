import { Router } from "express";
import { createUser, findOneUser, updateUser } from "../models/User.js";
import Customer from "../models/Customer.js";
import Inventory from "../models/Inventory.js";
import Invoice from "../models/Invoice.js";

const router = Router();

/**
 * 🆕 Create a new user
 */
router.post("/create-user", async (req, res) => {
  try {
    const {
      username,
      mobile,
      email,
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
      email,
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

// Add or update customer for specific user
router.post("/customer", async (req, res) => {
  try {
    const {
      userId,
      customerName,
      customerAddress,
      gstin,
      ownerName,
      contactNumber,
      email,
    } = req.body;

    if (!userId || !customerName || !customerAddress || !gstin) {
      return res.status(400).json({
        message: "userId, customerName, customerAddress and gstin are required",
      });
    }

    // Check if customer already exists for this user (by gstin or name)
    let customer = await Customer.findOne({ userId, gstin });

    if (customer) {
      // Update existing customer
      customer.customerName = customerName;
      customer.customerAddress = customerAddress;
      customer.ownerName = ownerName || customer.ownerName;
      customer.contactNumber = contactNumber || customer.contactNumber;
      customer.email = email || customer.email;

      await customer.save();
      return res.json({ message: "Customer updated successfully", customer });
    }

    // Create new customer
    customer = new Customer({
      userId,
      customerName,
      customerAddress,
      gstin,
      ownerName,
      contactNumber,
      email,
    });

    await customer.save();

    return res.json({ message: "Customer added successfully", customer });
  } catch (error) {
    console.error("Error in /customer:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all customers for a specific user
router.get("/get-all-customers", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const customers = await Customer.find({ userId }).sort({ createdAt: -1 });

    return res.json({
      message: "Customer list fetched successfully",
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Error in /customers:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ➡️ Add / Update Inventory
router.post("/inventory", async (req, res) => {
  try {
    const { userId, itemName, rate, HSN, isDeleted } = req.body;

    if (!userId || !itemName || !rate || !HSN) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if item exists for the user
    let item = await Inventory.findOne({ userId, itemName });

    if (item) {
      // Update existing
      item.rate = rate;
      item.HSN = HSN;
      if (isDeleted !== undefined) item.isDeleted = isDeleted;
      item.updatedAt = Date.now();
      await item.save();
      return res.json({ message: "Item updated successfully", item });
    }

    // Create new
    const newItem = new Inventory({
      userId,
      itemName,
      rate,
      HSN,
    });
    await newItem.save();

    return res.json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error("❌ Error saving inventory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ➡️ Get Inventory List for a User
router.get("/get-all-inventory", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const items = await Inventory.find({ userId, isDeleted: false }).sort({
      updatedAt: -1,
    });

    res.json({ message: "Inventory fetched successfully", items });
  } catch (error) {
    console.error("❌ Error fetching inventory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 🔹 Generate Invoice No
const generateInvoiceNo = async (supplierName) => {
  const shortName = supplierName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 3); // Sri Ganesh Traders → SGT
  const year = new Date().getFullYear();

  // Count existing invoices for this supplier in this year
  const count =
    230 ||
    (await Invoice.countDocuments({
      supplierName,
      createdAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    }));

  const serial = String(count + 1).padStart(4, "0"); // 0001, 0002
  return `${shortName}C${serial}`;
};

// 🔹 Create or Update Invoice
router.post("/invoice", async (req, res) => {
  try {
    const {
      userId,
      supplierName,
      customerId,
      itemId,
      qty,
      rate,
      vehicleNumber,
      miningChallan,
      dueDate,
      invoiceId, // optional for update
    } = req.body;

    // Fetch customer details
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    // Fetch inventory details
    const item = await Inventory.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    let invoice;

    if (invoiceId) {
      // 🔹 Update existing invoice
      invoice = await Invoice.findByIdAndUpdate(
        invoiceId,
        {
          qty,
          rate,
          vehicleNumber,
          miningChallan,
          dueDate,
          updatedAt: new Date(),
        },
        { new: true }
      );
    } else {
      // 🔹 Generate Invoice No
      const invoiceNo = await generateInvoiceNo(supplierName);

      // 🔹 Create new invoice
      invoice = new Invoice({
        userId,
        supplierName,
        invoiceNo,
        dueDate,
        vehicleNumber,
        miningChallan,

        customerId,
        customerName: customer.customerName,
        customerAddress: customer.customerAddress,
        customerGSTIN: customer.gstin,

        itemId,
        itemName: item.itemName,
        hsn: item.HSN,
        qty,
        rate,
      });

      await invoice.save();
    }

    res.status(200).json({
      message: invoiceId ? "Invoice updated ✅" : "Invoice created ✅",
      invoice,
    });
  } catch (error) {
    console.error("Invoice error:", error);
    res
      .status(500)
      .json({ message: "Failed to save invoice", error: error.message });
  }
});

// 🔹 Get Invoices by UserId
router.get("/get-all-invoices", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ invoices });
  } catch (error) {
    console.error("Fetch invoices error:", error);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
});

// Get Last Invoice for a User + Supplier
// Get Last Invoice Number using query params
router.get("/invoice/last", async (req, res) => {
  try {
    const { userId, supplierName } = req.query;

    if (!userId || !supplierName) {
      return res
        .status(400)
        .json({ message: "userId and supplierName are required" });
    }

    const lastInvoice = await Invoice.findOne({ userId, supplierName })
      .sort({ createdAt: -1 })
      .select("_id invoiceNo"); // only return id & invoiceNo

    if (!lastInvoice) {
      return res.status(200).json({ lastInvoiceId: null, lastInvoiceNo: null });
    }

    res.status(200).json({
      lastInvoiceId: lastInvoice._id,
      lastInvoiceNo: lastInvoice.invoiceNo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch last invoice number",
      error: error.message,
    });
  }
});

export default router;
