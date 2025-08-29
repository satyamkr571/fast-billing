import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    supplierName: { type: String, required: true }, // e.g. Sri Ganesh Traders
    invoiceNo: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    dueDate: { type: Date },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerName: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerGSTIN: { type: String, required: true },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    itemName: { type: String, required: true },
    hsn: { type: String, required: true },
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
    vehicleNumber: { type: String },
    miningChallan: { type: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

invoiceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
