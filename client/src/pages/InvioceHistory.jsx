import React, { useEffect, useState } from "react";
import "./InvoiceHistory.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../components/invoice/InvoicePDF";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "../utils/utils";

export default function InvoiceHistory({ userInfo }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [sortBy, setSortBy] = useState("invoiceNo"); // invoiceNo | date
  const navigate = useNavigate();

  // Sample Data (for demo: all current month invoices)
  const [invoices, setInvoices] = useState([]);

  // API Call to fetch invoices
  const getInvoiceList = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/get-all-invoices?userId=${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch invoices");
      }

      const data = await response.json();
      setInvoices(data?.invoices || []); // update state
    } catch (error) {
      alert(error.message || "Something went wrong while fetching invoices ❌");
    }
  };

  // Fetch invoices when user is available
  useEffect(() => {
    if (userInfo?._id) {
      getInvoiceList(userInfo._id);
    }
  }, [userInfo?._id]);

  // Filter by month
  const filteredInvoices = invoices.filter(
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

  const handleEdit = (invoiceData) => {
    navigate("/dashboard/create-invoice", {
      state: { invoiceData },
    });
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
                  <td>{formatDate(inv.date)}</td>
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
                <td style={{ fontWeight: "bold" }}>{totalQty + " MTS"}</td>
                <td style={{ fontWeight: "bold" }}>—</td>
                <td style={{ fontWeight: "bold" }}>
                  {formatCurrency(totalPrice)}
                </td>
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
