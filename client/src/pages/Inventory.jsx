import React, { useEffect, useState } from "react";
import "./Inventory.css";

export default function Inventory({ userInfo }) {
  const [itemName, setItemName] = useState("");
  const [HSN, setHSN] = useState("");
  const [rate, setRate] = useState("");
  const [inventory, setInventory] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getInventoryList = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/get-all-inventory?userId=${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch inventory");
      }

      const data = await response.json();

      // ✅ Update inventory list state
      setInventory(data?.items || []);
    } catch (error) {
      alert(
        error.message || "Something went wrong while fetching inventory ❌"
      );
    }
  };

  // Fetch inventory when userId changes
  useEffect(() => {
    userInfo?._id && getInventoryList(userInfo?._id);
  }, [userInfo?._id]);

  const saveOrUpdateInventory = async (userId, inventoryData) => {
    try {
      const response = await fetch("http://localhost:8080/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...inventoryData, // { itemName, rate, HSN, isDeleted }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save inventory item");
      }
      const data = await response.json();
      return data.item;
    } catch (error) {
      alert(error.message || "Something went wrong while saving inventory ❌");
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    // ✅ Validation
    if (!itemName || !HSN || !rate) {
      alert("Please fill all required fields!");
      return;
    }
    const inventoryData = {
      itemName,
      HSN,
      rate,
      isDeleted: false,
      _id: editingId || undefined, // If editing, pass _id to backend
    };

    try {
      // ✅ Save to backend
      const savedItem = await saveOrUpdateInventory(
        userInfo?._id,
        inventoryData
      );
      if (savedItem) {
        if (editingId) {
          // Update item in local state
          setInventory((prev) =>
            prev.map((item) => (item._id === editingId ? savedItem : item))
          );
          setEditingId(null);
        } else {
          // Add new item to local state
          setInventory((prev) => [...prev, savedItem]);
        }
      }
      // ✅ Reset form fields
      setItemName("");
      setHSN("");
      setRate("");
    } catch (error) {
      console.error("Error in handleAddOrUpdate:", error);
      alert("Failed to save inventory item ❌");
    }
  };

  const handleEdit = (item) => {
    setItemName(item.itemName);
    setHSN(item.HSN);
    setRate(item.rate);
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
              onChange={(e) => setRate(e.target.value)}
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
                  <tr key={item._id}>
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
