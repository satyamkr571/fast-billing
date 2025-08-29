import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import "./Invoice.css";
import InvoiceForm from "./invoiceForm";
import InvoicePDF from "./InvoicePDF";
import { useLocation } from "react-router-dom";

// Main Component
export default function InvoiceGenerator({ userInfo, customers, itemList }) {
  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);
  const defaultDueDate = dueDate.toISOString().split("T")[0];
  const location = useLocation();
  const { invoiceData } = location.state || {};
  const [formErrors, setFormErrors] = useState([]);

  const [formData, setFormData] = useState(
    invoiceData || {
      invoiceNo: "",
      date: today,
      dueDate: defaultDueDate,
      vehicleNumber: "",
      miningChallan: "",
      customerName: "",
      customerId: "",
      customerAddress: "",
      customerGSTIN: "",
      itemId: "",
      itemName: undefined,
      hsn: "25171010",
      qty: "",
      rate: "",
    }
  );

  const saveInvoiceHandler = async () => {
    try {
      const payload = {
        userId: userInfo._id, // replace with logged-in user
        supplierName: userInfo.supplierName,

        // customer & item IDs (from dropdown selections ideally)
        customerId: formData.customerId,
        itemId: formData.itemId,

        qty: formData.qty,
        rate: formData.rate,
        vehicleNumber: formData.vehicleNumber,
        miningChallan: formData.miningChallan,
        dueDate: formData.dueDate,
        invoiceId: formData._id, // update
      };

      const res = await fetch("http://localhost:8080/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        // Update local state with backend response (e.g. invoiceNo)
        setFormData((prev) => ({
          ...prev,
          ...data.invoice,
        }));
      } else {
        alert(data.message || "Failed to save invoice");
      }
    } catch (error) {
      console.error("Save invoice error:", error);
      alert("Error saving invoice");
    }
  };

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
        updatedForm.customerGSTIN = selected.gstin;
        updatedForm.customerId = selected._id;
      }
    }

    if (name === "itemName") {
      const selectedItem = itemList.find((item) => item.itemName === value);
      if (selectedItem) {
        updatedForm.rate = selectedItem.rate.toString();
        const qty = parseFloat(formData.qty || 0);
        const taxable = (qty * selectedItem.rate).toFixed(2);
        const gst = (taxable * 0.05).toFixed(2);
        const total = (parseFloat(taxable) + parseFloat(gst)).toFixed(2);
        updatedForm.gst = gst;
        updatedForm.totalAmount = total;
        updatedForm.itemId = selectedItem._id;
      }
    }

    setFormData(updatedForm);
  };

  // ✅ Function to generate next invoice number
  const generateNextInvoiceNo = (lastInvoiceNo) => {
    const prefix = lastInvoiceNo.slice(0, 3); // e.g. SGTS
    const serial = parseInt(lastInvoiceNo.slice(4)) + 1; // increment

    return `${prefix}${serial.toString().padStart(4, "0")}`;
  };

  useEffect(() => {
    const fetchLastInvoice = async (userId, supplierName) => {
      try {
        const query = new URLSearchParams({ userId, supplierName }).toString();
        const res = await fetch(
          `http://localhost:8080/api/invoice/last?${query}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch last invoice");
        }

        const data = await res.json();
        const { lastInvoiceNo } = data;

        const nextInvoiceNo = generateNextInvoiceNo(lastInvoiceNo);

        setFormData((prev) => ({
          ...prev,
          invoiceNo: nextInvoiceNo,
        }));
      } catch (err) {
        console.error("Error fetching last invoice:", err);
      }
    };

    if ((userInfo._id, userInfo.supplierName, !invoiceData)) {
      fetchLastInvoice(userInfo._id, userInfo.supplierName);
    }
  }, [userInfo._id, userInfo.supplierName, invoiceData]);

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
            <button onClick={saveInvoiceHandler} className="download-btn">
              {loading ? "Preparing..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
