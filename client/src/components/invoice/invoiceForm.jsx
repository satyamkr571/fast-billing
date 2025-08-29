import "./Invoice.css";

const InvoiceForm = ({ formData, handleChange, itemList, customers }) => (
  <div className="invoice-form">
    <h2 className="form-title">🧾 Invoice Details</h2>

    <div className="form-grid">
      <div className="form-group">
        <label>Invoice No</label>
        <input
          name="invoiceNo"
          value={formData.invoiceNo}
          onChange={handleChange}
          placeholder="Enter invoice number"
        />
      </div>

      <div className="form-group">
        <label>Invoice Date</label>
        <input
          type="date"
          name="date"
          value={new Date(formData.date).toISOString().split("T")[0]}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={new Date(formData.dueDate).toISOString().split("T")[0]}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Customer</label>
        <select
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}>
          <option value="">-- Select a Customer --</option>
          {customers.map((customer) => (
            <option key={customer.customerName} value={customer.customerName}>
              {customer.customerName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Transport Type</label>
        <input
          name="transportType"
          value={"Road Transport - Truck"}
          onChange={handleChange}
          placeholder="E.g. Road, Rail"
          disabled={true}
        />
      </div>

      <div className="form-group">
        <label>Vehicle Number</label>
        <input
          name="vehicleNumber"
          value={formData.vehicleNumber}
          onChange={handleChange}
          placeholder="Enter vehicle number"
        />
      </div>

      <div className="form-group">
        <label>Mining Challan</label>
        <input
          name="miningChallan"
          value={formData.miningChallan}
          onChange={handleChange}
          placeholder="Enter challan number"
        />
      </div>

      <div className="form-group">
        <label>Item Description</label>
        <select
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}>
          <option value="">-- Select an Item --</option>
          {itemList.map((item) => (
            <option key={item.itemName} value={item.itemName}>
              {item.itemName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          name="qty"
          value={formData.qty}
          onChange={handleChange}
          placeholder="Enter quantity"
        />
      </div>

      <div className="form-group">
        <label>Rate</label>
        <input
          name="rate"
          value={formData.rate}
          onChange={handleChange}
          placeholder="Enter rate"
        />
      </div>
    </div>
  </div>
);

export default InvoiceForm;
