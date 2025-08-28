import React from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import "./Dashboard.css";
import InvoiceGenerator from "../components/invoice/Invoice";
import Inventory from "./Inventory";
import Customer from "./Customer";
import InvoiceHistory from "./InvioceHistory";

const cards = [
  { title: "Create New Invoice", path: "/dashboard/create-invoice" },
  { title: "Add New Customer", path: "/dashboard/add-customer" },
  { title: "Add New Inventory", path: "/dashboard/add-inventory" },
  { title: "Invoice History", path: "/dashboard/invoice-history" },
];

export default function Dashboard({ userInfo }) {
  return (
    <div className="dashboard-container">
      {/* Tab Menu */}
      <div className="tab-menu">
        {cards.map((card, index) => (
          <NavLink
            key={index}
            to={card.path}
            className={({ isActive }) =>
              isActive ? "tab-link active" : "tab-link"
            }>
            {card.title}
          </NavLink>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <Routes>
          {/* Default Redirect */}
          <Route
            index
            element={<Navigate to="/dashboard/create-invoice" replace />}
          />
          <Route
            path="create-invoice"
            element={<InvoiceGenerator userInfo={userInfo} />}
          />
          <Route path="add-customer" element={<Customer />} />
          <Route path="add-inventory" element={<Inventory />} />
          <Route
            path="invoice-history"
            element={<InvoiceHistory userInfo={userInfo} />}
          />
        </Routes>
      </div>
    </div>
  );
}
