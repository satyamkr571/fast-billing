import React, { useState } from "react";
import "./Inventory.css";

export default function Inventory() {
  const [itemName, setItemName] = useState("");
  const [HSN, setHSN] = useState("");
  const [rate, setrate] = useState("");
  const [inventory, setInventory] = useState([
    { itemName: "Stone Boulder (No Size)", rate: 1400, HSN: "25171010" },
    { itemName: "Stone Boulder - No Size", rate: 1620, HSN: "25171010" },
    { itemName: "Stone Chip (60MM)", rate: 1100, HSN: "25171010" },
  ]);
  const [editingId, setEditingId] = useState(null);

  const handleAddOrUpdate = (e) => {
    e.preventDefault();

    if (!itemName || !HSN || !rate) {
      alert("Please fill all fields!");
      return;
    }

    if (editingId) {
      // Update existing item
      setInventory(
        inventory.map((item) =>
          item.id === editingId ? { ...item, itemName, HSN, rate } : item
        )
      );
      setEditingId(null);
    } else {
      // Add new item
      const newItem = { id: Date.now(), itemName, HSN, rate };
      setInventory([...inventory, newItem]);
    }

    // Reset fields
    setItemName("");
    setHSN("");
    setrate("");
  };

  const handleEdit = (item) => {
    setItemName(item.itemName);
    setHSN(item.HSN);
    setrate(item.rate);
    setEditingId(item.id);
  };

  return (
    <div className="add-inventory-page">
      <h2>{editingId ? "Edit Inventory Item" : "Add New Inventory"}</h2>

      {/* Form Card */}
      <div className="form-card">
        <form onSubmit={handleAddOrUpdate} className="inventory-form">
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="form-group">
            <label>HSN</label>
            <input
              type="text"
              value={HSN}
              onChange={(e) => setHSN(e.target.value)}
              placeholder="Enter HSN code"
              required
            />
          </div>

          <div className="form-group">
            <label>rate (₹)</label>
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setrate(e.target.value)}
              placeholder="Enter rate"
              required
            />
          </div>

          <button type="submit" className="add-btn">
            {editingId ? "✅ Update Item" : "➕ Add Item"}
          </button>
        </form>
      </div>

      {/* Inventory List Table */}
      {inventory.length > 0 && (
        <div className="table-card">
          <h3>Inventory List</h3>
          <div className="table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>HSN</th>
                  <th>Rate (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.itemName}</td>
                    <td>{item.HSN}</td>
                    <td>{item.rate}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(item)}>
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
