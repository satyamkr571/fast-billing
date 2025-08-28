import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import "./Invoice.css";
import InvoiceForm from "./invoiceForm";
import InvoicePDF from "./InvoicePDF";

// Dummy Customers
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

// Main Component
export default function InvoiceGenerator({ userInfo }) {
  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);
  const defaultDueDate = dueDate.toISOString().split("T")[0];

  const [formErrors, setFormErrors] = useState([]);
  const [formData, setFormData] = useState({
    invoiceNo: "SGTC0040",
    date: today,
    dueDate: defaultDueDate,
    vehicleNumber: "",
    miningChallan: "",
    customerName: customers[0].customerName,
    customerAddress: customers[0].customerAddress,
    customerGSTIN: customers[0].customerGSTIN,
    item: undefined,
    hsn: "25171010",
    qty: "",
    rate: "",
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
        const qty = parseFloat(formData.qty || 0);
        const taxable = (qty * selectedItem.rate).toFixed(2);
        const gst = (taxable * 0.05).toFixed(2);
        const total = (parseFloat(taxable) + parseFloat(gst)).toFixed(2);
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
        customers={customers}
      />

      {formErrors.length > 0 && (
        <div className="error-message">
          Please fill in the following fields: {formErrors.join(", ")}
        </div>
      )}

      <div
        className="download-container"
        onClick={() => {
          const errors = validateForm();
          if (errors.length > 0) {
            setFormErrors(errors);
          } else {
            setFormErrors([]);
          }
        }}>
        <PDFDownloadLink
          className={`download-link ${
            validateForm().length > 0 ? "disabled" : ""
          }`}
          document={<InvoicePDF data={formData} userInfo={userInfo} />}
          fileName={formData.invoiceNo + ".pdf"}>
          {({ loading }) => (
            <button className="download-btn">
              {loading ? "Preparing..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
