import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import "./Invoice.css";
import NotoSans from "../../font/NotoSans.ttf";

// Font for PDF
Font.register({
  family: "NotoSans",
  fonts: [{ src: NotoSans }],
});

// PDF Styles (keep separate)
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
  contact: { fontSize: 10, marginBottom: 8, color: "#f0faff" },
  section: {
    padding: "16 24",
    marginBottom: 10,
    backgroundColor: "#e0f0f8",
    borderRadius: 4,
  },
  label: { fontWeight: "bold", color: "#01497c" },
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
  tableCell: { flex: 1, textAlign: "center", fontSize: 10 },
  signature: { textAlign: "right", padding: "2 40", color: "#000000" },
  signatureText: { textAlign: "right", padding: "2 14", color: "#0277bd" },
  note: { padding: "4 24", fontSize: 9, color: "#666" },
});

// Utility Functions
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
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// PDF Template
const InvoicePDF = ({ data, userInfo }) => {
  const IGST = (parseFloat(data.qty * data.rate) * 0.05).toFixed(2);
  const total = (parseFloat(data.qty * data.rate) + parseFloat(IGST)).toFixed(
    2
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headSection}>
          <Text style={styles.heading}>
            {userInfo?.supplierName?.toUpperCase()}
          </Text>
          <Text style={styles.contact}>
            {`${userInfo?.supplierAddress?.toUpperCase()} | Phone : +91 ${
              userInfo?.mobile
            } | Email : ${userInfo?.email}`}
          </Text>
          <Text style={styles.contact}>GSTIN: {userInfo?.GSTIn}</Text>
        </View>

        <Text style={styles.subHeading}>Tax Invoice</Text>

        {/* Invoice Details */}
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
            <Text style={styles.label}>Transport Type:</Text>{" "}
            {"Road Transport - Truck"}
          </Text>
          <Text>
            <Text style={styles.label}>Vehicle No:</Text> {data.vehicleNumber}
          </Text>
          <Text>
            <Text style={styles.label}>Mining Challan:</Text>{" "}
            {data.miningChallan}
          </Text>
        </View>

        {/* Supplier */}
        <View style={styles.section}>
          <Text style={styles.label}>Ship From:</Text>
          <Text>
            {userInfo?.supplierName}, {userInfo?.supplierAddress},
          </Text>
          <Text>GSTIN: {userInfo?.supplierGSTIN}</Text>
        </View>

        {/* Customer */}
        <View style={styles.section}>
          <Text style={styles.label}>Bill To:</Text>
          <Text>{data.customerName}</Text>
          <Text>{data.customerAddress}</Text>
          <Text>GSTIN: {data.customerGSTIN}</Text>
        </View>

        {/* Table */}
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
            <Text style={styles.tableCell}>
              {(parseFloat(data.qty) * parseFloat(data.rate)).toFixed(2)}
            </Text>
            <Text style={styles.tableCell}>{IGST}</Text>
            <Text style={styles.tableCell}>{total}</Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>Sub Total:</Text> ₹{" "}
            {(parseFloat(data.qty) * parseFloat(data.rate)).toFixed(2)}
          </Text>
          <Text>
            <Text style={styles.label}>IGST:</Text> ₹ {IGST}
          </Text>
          <Text>
            <Text style={styles.label}>Total Amount:</Text> ₹ {total}
          </Text>
          <Text>
            <Text style={styles.label}>Amount in Words:</Text>{" "}
            {numberToWordsIndian(total)}
          </Text>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.label}>Payment Details</Text>
          <Text>Bank: {userInfo?.bank}</Text>
          <Text>A/C Name: {userInfo?.accountName}</Text>
          <Text>Account No: {userInfo?.accountNumber}</Text>
          <Text>IFSC: {userInfo?.ifsc}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.note}>
          All subject to {userInfo?.supplierName} Hometown Jurisdiction.
        </Text>
        <Text style={styles.signature}>Authorised Signature</Text>
        <Text style={styles.signatureText}>{userInfo?.supplierName}</Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
