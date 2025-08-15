// Invoice Generator with dynamic customer list, GST calculation, and full PDF support
import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import "./Invoice.css";
import NotoSans from "../../font/NotoSans.ttf";

Font.register({
  family: "NotoSans",
  fonts: [
    {
      src: NotoSans,
    },
  ],
});
const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    fontFamily: "NotoSans",
    color: "#333",
    backgroundColor: "#f0faff",
  },
  headSection: {
    color: "#f0faff",
    backgroundColor: "rgb(16, 89, 129)",
    padding: "12 24",
  },
  heading: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#f0faff",
  },
  subHeading: {
    textAlign: "center",
    fontSize: 20,
    padding: "6px 8px",
    color: "#000",
  },
  contact: {
    fontSize: 10,
    marginBottom: 8,
    color: "#f0faff",
  },
  section: {
    padding: "16 24",
    marginBottom: 10,
    backgroundColor: "#e0f0f8",
    borderRadius: 4,
  },
  label: {
    fontWeight: "bold",
    color: "#01497c",
  },
  table: {
    borderWidth: 1,
    borderColor: "#01497c",
    overflow: "hidden",
    margin: "6 12",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#cfe8f3",
    borderBottomWidth: 1,
    borderColor: "#01497c",
    padding: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#b3e5fc",
    padding: 6,
    backgroundColor: "#f5fbff",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
  },
  signature: {
    textAlign: "right",
    padding: "2 40",
    color: "#000000",
  },
  signatureText: {
    textAlign: "right",
    padding: "2 14",
    color: "#0277bd",
  },
  note: {
    padding: "4 24",
    fontSize: 9,
    color: "#666",
  },
});

function numberToWordsIndian(num) {
  if (isNaN(num)) return "Invalid number";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function twoDigits(n) {
    if (n < 10) return ones[n];
    else if (n < 20) return teens[n - 10];
    else return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  }

  function convert(n) {
    let result = "";

    if (n >= 100000) {
      result += twoDigits(Math.floor(n / 100000)) + " Lakh ";
      n %= 100000;
    }
    if (n >= 1000) {
      result += twoDigits(Math.floor(n / 1000)) + " Thousand ";
      n %= 1000;
    }
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n > 0) {
      result += (result ? "and " : "") + twoDigits(n);
    }

    return result.trim();
  }

  // Split integer and decimal parts
  const parts = num.toString().split(".");
  const intPart = parseInt(parts[0]);
  const decimalPart = parts[1]
    ? parseInt(parts[1].padEnd(2, "0").slice(0, 2))
    : null;

  let words = convert(intPart) || "Zero";
  if (decimalPart && decimalPart > 0) {
    words += " point";
    for (let digit of decimalPart.toString()) {
      words += " " + ones[parseInt(digit)];
    }
  }

  return " " + words + " Rupees Only/-";
}
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const customers = [
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
];

const InvoicePDF = ({ data }) => {
  const IGST = (parseFloat(data.taxableValue) * 0.05).toFixed(2);
  const total = (parseFloat(data.taxableValue) + parseFloat(IGST)).toFixed(2);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headSection}>
          <Text style={styles.heading}>Sri Ganesh Traders and Suppliers</Text>
          <Text style={styles.contact}>
            KATARI ROAD, SHEIKHPURA, BIHAR - 811105 | Ph: +91 9905228146 |
            rajivkumar990522@gmail.com
          </Text>
          <Text style={styles.contact}>GSTIN: 10BNMPK4670G1Z4</Text>
        </View>
        <Text style={styles.subHeading}>Tax Invoice</Text>

        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>Invoice No:</Text> {data.invoiceNo}
          </Text>
          <Text>
            <Text style={styles.label}>Date:</Text> {formatDate(data.date)}
          </Text>
          <Text>
            <Text style={styles.label}>Due Date:</Text>{" "}
            {formatDate(data.dueDate)}
          </Text>
          <Text>
            <Text style={styles.label}>Transport Type:</Text>
            {data.transportType}
          </Text>
          <Text>
            <Text style={styles.label}>Vehicle No:</Text> {data.vehicleNumber}
          </Text>
          <Text>
            <Text style={styles.label}>Mining Challan:</Text>
            {data.miningChallan}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Ship From:</Text>
          <Text>
            {data.supplierName}, {data.supplierAddress}, | State Code - 10
          </Text>
          <Text>GSTIN: {data.supplierGSTIN}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bill To:</Text>
          <Text>{data.customerName}</Text>
          <Text>{data.customerAddress}</Text>
          <Text>GSTIN: {data.customerGSTIN}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Item</Text>
            <Text style={styles.tableCell}>HSN</Text>
            <Text style={styles.tableCell}>Qty</Text>
            <Text style={styles.tableCell}>Rate (₹)</Text>
            <Text style={styles.tableCell}>Taxable (₹)</Text>
            <Text style={styles.tableCell}>IGST (₹)</Text>
            <Text style={styles.tableCell}>Total (₹)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.item}</Text>
            <Text style={styles.tableCell}>{data.hsn}</Text>
            <Text style={styles.tableCell}>{data.qty}</Text>
            <Text style={styles.tableCell}>{data.rate}</Text>
            <Text style={styles.tableCell}>{data.taxableValue}</Text>
            <Text style={styles.tableCell}>{IGST}</Text>
            <Text style={styles.tableCell}>{total}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>Sub Total:</Text> ₹ {data.taxableValue}
          </Text>
          <Text>
            <Text style={styles.label}>IGST:</Text> ₹ {IGST}
          </Text>
          <Text>
            <Text style={styles.label}>Total Amount:</Text> ₹ {total}
          </Text>
          <Text>
            <Text style={styles.label}>Amount in Words:</Text>
            {numberToWordsIndian(total)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Payment Details</Text>
          <Text>Bank: {data.bank}</Text>
          <Text>A/C Name: {data.accountName}</Text>
          <Text>Account No: {data.accountNumber}</Text>
          <Text>IFSC: {data.ifsc}</Text>
        </View>

        <Text style={styles.note}>All subject to Sheikhpura Jurisdiction.</Text>
        <Text style={styles.signature}>Authorised Signature</Text>
        <Text style={styles.signatureText}>
          Sri Ganesh Traders and Suppliers
        </Text>
      </Page>
    </Document>
  );
};

const InvoiceForm = ({ formData, handleChange, itemList }) => (
  <div className="invoice-form">
    <div className="invoice-row">
      <label>Invoice No:</label>
      <input
        name="invoiceNo"
        value={formData.invoiceNo}
        onChange={handleChange}
      />
    </div>
    <div className="invoice-row">
      <label>Invoice Date:</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
    </div>
    <div className="invoice-row">
      <label>Due Date:</label>
      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
      />
    </div>
    <div className="invoice-row">
      <label>Customer:</label>
      <select
        name="customerName"
        value={formData.customerName}
        onChange={handleChange}
        className="wide">
        {customers.map((customer) => (
          <option key={customer.customerName} value={customer.customerName}>
            {customer.customerName}
          </option>
        ))}
      </select>
    </div>
    <div className="invoice-row">
      <label>Transport Type:</label>
      <input
        name="transportType"
        value={formData.transportType}
        onChange={handleChange}
      />
    </div>
    <div className="invoice-row">
      <label>Vehicle Number:</label>
      <input
        name="vehicleNumber"
        value={formData.vehicleNumber}
        onChange={handleChange}
      />
    </div>
    <div className="invoice-row">
      <label>Mining Challan:</label>
      <input
        name="miningChallan"
        value={formData.miningChallan}
        onChange={handleChange}
      />
    </div>
    <div className="invoice-row">
      <label>Item Description:</label>
      <select
        name="item"
        value={formData.item}
        onChange={handleChange}
        className="wide">
        <option value="">-- Select an Item --</option>
        {itemList.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
    <div className="invoice-row">
      <label>Quantity:</label>
      <input name="qty" value={formData.qty} onChange={handleChange} />
    </div>
    <div className="invoice-row">
      <label>Rate:</label>
      <input name="rate" value={formData.rate} onChange={handleChange} />
    </div>
  </div>
);
export default function InvoiceGenerator() {
  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);
  const defaultDueDate = dueDate.toISOString().split("T")[0];
  const [formErrors, setFormErrors] = useState([]);
  const [formData, setFormData] = useState({
    invoiceNo: "SGTC0040",
    date: today,
    dueDate: defaultDueDate,
    transportType: "Road Transport - Truck",
    vehicleNumber: "",
    miningChallan: "",
    supplierName: "Sri Ganesh Traders and Suppliers",
    supplierAddress: "Katari Road, Sheikhpura, Bihar - 811105",
    supplierGSTIN: "10BNMPK4670G1Z4",
    customerName: customers[0].customerName,
    customerAddress: customers[0].customerAddress,
    customerGSTIN: customers[0].customerGSTIN,
    item: undefined,
    hsn: "25171010",
    qty: "",
    rate: "",
    taxableValue: "0",
    gst: "0",
    totalAmount: "0",
    amountInWords: "",
    bank: "Canara Bank",
    accountName: "SRI GANESH TRADERS AND SUPPLIERS",
    accountNumber: "1722201001028",
    ifsc: "CNRB0001722",
  });
  const itemList = [
    { name: "Stone Boulder (No Size)", rate: 1400 },
    { name: "Stone Boulder - No Size", rate: 1620 },
    { name: "Stone Chip (60MM)", rate: 1100 },
  ];
  const validateForm = () => {
    const { vehicleNumber, item, qty, rate } = formData;
    const errors = [];

    if (!vehicleNumber.trim()) errors.push("Vehicle Number");
    if (!item?.trim()) errors.push("Item Description");
    if (!qty || isNaN(qty)) errors.push("Quantity");
    if (!rate || isNaN(rate)) errors.push("Rate");

    return errors;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    if (name === "qty" || name === "rate") {
      const qty = parseFloat(name === "qty" ? value : formData.qty || 0);
      const rate = parseFloat(name === "rate" ? value : formData.rate || 0);
      const taxable = (qty * rate).toFixed(2);
      const gst = (taxable * 0.05).toFixed(2);
      const total = (parseFloat(taxable) + parseFloat(gst)).toFixed(2);

      updatedForm.taxableValue = taxable;
      updatedForm.gst = gst;
      updatedForm.totalAmount = total;
    }

    if (name === "customerName") {
      const selected = customers.find((c) => c.customerName === value);
      if (selected) {
        updatedForm.customerAddress = selected.customerAddress;
        updatedForm.customerGSTIN = selected.customerGSTIN;
      }
    }
    if (name === "item") {
      const selectedItem = itemList.find((item) => item.name === value);
      if (selectedItem) {
        updatedForm.rate = selectedItem.rate.toString();
        // Recalculate totals based on new rate
        const qty = parseFloat(formData.qty || 0);
        const taxable = (qty * selectedItem.rate).toFixed(2);
        const gst = (taxable * 0.05).toFixed(2);
        const total = (parseFloat(taxable) + parseFloat(gst)).toFixed(2);

        updatedForm.taxableValue = taxable;
        updatedForm.gst = gst;
        updatedForm.totalAmount = total;
      }
    }
    setFormData(updatedForm);
  };

  return (
    <div className="invoice-generator-container">
      <InvoiceForm
        formData={formData}
        handleChange={handleChange}
        itemList={itemList}
      />
      {formErrors.length > 0 && (
        <div style={{ color: "red", marginTop: "10px" }}>
          Please fill in the following fields: {formErrors.join(", ")}
        </div>
      )}
      <div
        style={{ marginTop: "20px" }}
        onClick={() => {
          const errors = validateForm();
          if (errors.length > 0) {
            setFormErrors(errors);
          } else {
            setFormErrors([]);
          }
        }}>
        <PDFDownloadLink
          style={validateForm().length > 0 ? { pointerEvents: "none" } : {}}
          document={<InvoicePDF data={formData} />}
          fileName={formData.invoiceNo + ".pdf"}>
          {({ loading }) => (
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#01579b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}>
              {loading ? "Preparing..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
