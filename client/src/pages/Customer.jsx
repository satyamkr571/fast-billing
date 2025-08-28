import React, { useState } from "react";
import "./Customer.css";

export default function Customer() {
  const [customers, setCustomers] = useState([
    {
      customerName: "ADITYA MINERAL",
      customerAddress:
        "JL NO 60, PLOT NO 223,224, SALANPUR, West Bengal - 713359",
      customerGSTIN: "19AGIPA4725G1ZK",
    },
    {
      customerName: "Maa Sherawali Refractory",
      customerAddress:
        "Na, Debipur, Kulti, Paschim Bardhaman,West Bengal - 713369",
      customerGSTIN: "19KGWPK3868J1Z5",
    },
    {
      customerName: "Shreeja Roadlines",
      customerAddress:
        "Majidia Park, Kulti, Paschim Bardhaman,West Bengal - 713343",
      customerGSTIN: "19AJDPS2978R1Z2",
    },
    {
      customerName: "Jajoo Rashmi Refractories Limited",
      customerAddress:
        "Plot No -416, Mouza-maheshpur At Kadavita, Dendua Road, Po Kalyaneshwari, Kadavita, Bardhaman, West Bengal - 713369",
      customerGSTIN: "19AAACJ8517G1ZG",
    },
  ]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    ownerName: "",
    customerAddress: "",
    customerGSTIN: "",
    contactNumber: "",
    customerEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrUpdateCustomer = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedCustomers = [...customers];
      updatedCustomers[editingIndex] = formData;
      setCustomers(updatedCustomers);
      setEditingIndex(null);
    } else {
      setCustomers([...customers, formData]);
    }
    setFormData({
      customerName: "",
      ownerName: "",
      customerAddress: "",
      customerGSTIN: "",
      contactNumber: "",
      customerEmail: "",
    });
  };

  const handleEdit = (index) => {
    setFormData(customers[index]);
    setEditingIndex(index);
  };

  return (
    <div className="customer-manager">
      <div className="form-section">
        <h2>{editingIndex !== null ? "Edit Customer" : "Add New Customer"}</h2>
        <form onSubmit={handleAddOrUpdateCustomer} className="customer-form">
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Customer Address</label>
            <textarea
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>GSTIN</label>
            <input
              type="text"
              name="customerGSTIN"
              value={formData.customerGSTIN}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Owner Name (Optional)</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Contact Number (Optional)</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email ID (Optional)</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {editingIndex !== null ? "Update Customer" : "Add Customer"}
          </button>
        </form>
      </div>

      <div className="list-section">
        <h2>Customer List</h2>
        {customers.length === 0 ? (
          <p className="no-data">No customers added yet.</p>
        ) : (
          <div className="customer-list">
            {customers.map((customer, index) => (
              <div key={index} className="customer-card">
                <h3>{customer.customerName}</h3>
                {customer.ownerName && (
                  <p>
                    <strong>Owner:</strong> {customer.ownerName}
                  </p>
                )}
                <p>
                  <strong>Address:</strong> {customer.customerAddress}
                </p>
                <p>
                  <strong>GSTIN:</strong> {customer.customerGSTIN}
                </p>
                <p>
                  <strong>Email:</strong> {customer.contactNumber}
                </p>
                <p>
                  <strong>Contact Number:</strong> {customer.customerEmail}
                </p>
                <button className="edit-btn" onClick={() => handleEdit(index)}>
                  ✏️ Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
