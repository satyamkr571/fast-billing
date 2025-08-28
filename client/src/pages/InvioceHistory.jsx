import React, { useState } from "react";
import "./InvoiceHistory.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../components/invoice/InvoicePDF";

// Dummy Customers
// const customers = [
//   {
//     customerName: "ADITYA MINERAL",
//     customerAddress:
//       "JL NO 60, PLOT NO 223,224, SALANPUR, West Bengal - 713359",
//     customerGSTIN: "19AGIPA4725G1ZK",
//   },
//   {
//     customerName: "Maa Sherawali Refractory",
//     customerAddress:
//       "Na, Debipur, Kulti, Paschim Bardhaman,West Bengal - 713369",
//     customerGSTIN: "19KGWPK3868J1Z5",
//   },
//   {
//     customerName: "Shreeja Roadlines",
//     customerAddress:
//       "Majidia Park, Kulti, Paschim Bardhaman,West Bengal - 713343",
//     customerGSTIN: "19AJDPS2978R1Z2",
//   },
//   {
//     customerName: "Jajoo Rashmi Refractories Limited",
//     customerAddress:
//       "Plot No -416, Mouza-maheshpur At Kadavita, Dendua Road, Po Kalyaneshwari, Kadavita, Bardhaman, West Bengal - 713369",
//     customerGSTIN: "19AAACJ8517G1ZG",
//   },
// ];

export default function InvoiceHistory({ userInfo }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [sortBy, setSortBy] = useState("invoiceNo"); // invoiceNo | date
  const [, setEditingInvoice] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);
  const defaultDueDate = dueDate.toISOString().split("T")[0];

  // Sample Data (for demo: all current month invoices)
  const invoicesData = [
    {
      invoiceNo: "SGTC0040",
      date: today,
      dueDate: defaultDueDate,
      vehicleNumber: "NL01AD2314",
      miningChallan: "",
      customerName: "ADITYA MINERAL",
      customerAddress:
        "JL NO 60, PLOT NO 223,224, SALANPUR, West Bengal - 713359",
      customerGSTIN: "19AGIPA4725G1ZK",
      item: "Stone Boulder (No Size)",
      hsn: "25171010",
      qty: 43.44,
      rate: 1620,
    },
  ];

  // Filter by month
  const filteredInvoices = invoicesData.filter(
    (inv) => new Date(inv.date).getMonth() + 1 === month
  );

  // Sorting
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortBy === "invoiceNo") return a.invoiceNo - b.invoiceNo;
    if (sortBy === "date") return new Date(a.date) - new Date(b.date);
    return 0;
  });

  // Totals
  const totalQty = sortedInvoices.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = sortedInvoices.reduce(
    (sum, i) => sum + i.qty * i.rate * 1.05,
    0
  );

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    alert(`Editing invoice ${invoice.invoiceNo}`);
  };

  return (
    <div className="invoice-page">
      <h2>Invoice Manager</h2>

      {/* Controls */}
      <div className="invoice-controls">
        <label>
          Month:
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2025, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="invoiceNo">Invoice No</option>
            <option value="date">Date</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="invoice-table-container">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Rate (₹)</th>
              <th>Price (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedInvoices.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No invoices for this month
                </td>
              </tr>
            ) : (
              sortedInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoiceNo}</td>
                  <td>{inv.date}</td>
                  <td>{inv.customerName}</td>
                  <td>{inv.qty}</td>
                  <td>{inv.rate}</td>
                  <td>{inv.rate * inv.qty * 1.05}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(inv)}>
                      ✏️ Edit
                    </button>
                    <PDFDownloadLink
                      key={inv.invoiceNo}
                      className={`download-link`}
                      document={<InvoicePDF data={inv} userInfo={userInfo} />}
                      fileName={inv.invoiceNo + ".pdf"}>
                      {({ loading }) => (
                        <button className="download-btn">
                          {loading ? "Preparing..." : " ⬇️ Download"}
                        </button>
                      )}
                    </PDFDownloadLink>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {sortedInvoices.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan="3" style={{ fontWeight: "bold" }}>
                  Totals
                </td>
                <td style={{ fontWeight: "bold" }}>{totalQty}</td>
                <td style={{ fontWeight: "bold" }}>—</td>
                <td style={{ fontWeight: "bold" }}>{totalPrice}</td>
                <td style={{ fontWeight: "bold" }}>
                  {sortedInvoices.length} Invoices
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
