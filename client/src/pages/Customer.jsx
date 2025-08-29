import React, { useEffect, useState } from "react";
import "./Customer.css";

export default function Customer({ userInfo }) {
  const [customers, setCustomers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    gstin: "",
    ownerName: "",
    contactNumber: "",
    email: "",
  });

  const getCustomerList = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/get-all-customers?userId=${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch customers");
      }

      const data = await response.json();

      // ✅ Update customers list
      setCustomers(data?.customers || []);
    } catch (error) {
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    userInfo?._id && getCustomerList(userInfo?._id);
  }, [userInfo?._id]);

  const saveOrUpdateCustomer = async (userId, customerData) => {
    try {
      const response = await fetch("http://localhost:8080/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...customerData, // contains customerName, address, GSTIN, etc.
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save customer");
      }
      const data = await response.json();
      return data.customer;
    } catch (error) {
      alert(error.message || "Something went wrong while saving customer ❌");
    }
  };

  const handleAddOrUpdateCustomer = async (e) => {
    e.preventDefault();

    try {
      // Call API to add/update in DB
      const savedCustomer = await saveOrUpdateCustomer(userInfo._id, formData);

      if (editingIndex !== null) {
        // Update customer in local state
        const updatedCustomers = [...customers];
        updatedCustomers[editingIndex] = savedCustomer || formData;
        setCustomers(updatedCustomers);
        setEditingIndex(null);
      } else {
        // Add new customer in local state
        setCustomers([...customers, savedCustomer || formData]);
      }

      // Reset form
      setFormData({
        customerName: "",
        customerAddress: "",
        gstin: "",
        ownerName: "",
        contactNumber: "",
        email: "",
      });
    } catch (error) {
      alert(error.message || "Failed to add/update customer ❌");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
              name="gstin"
              value={formData.gstin}
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
              name="email"
              value={formData.email}
              onChange={handleChange}
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
                  <strong>GSTIN:</strong> {customer.gstin}
                </p>
                <p>
                  <strong>Email:</strong> {customer.contactNumber}
                </p>
                <p>
                  <strong>Contact Number:</strong> {customer.email}
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
