import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itemName: { type: String, required: true },
  rate: { type: Number, required: true },
  HSN: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

inventorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
