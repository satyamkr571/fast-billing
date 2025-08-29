import React, { useEffect, useState } from "react";
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
  const [customers, setCustomers] = useState([]);
  const [itemList, setItemList] = useState([]);

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

  const getInventoryList = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/get-all-inventory?userId=${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch inventory");
      }

      const data = await response.json();

      // ✅ Update inventory list state
      setItemList(data?.items || []);
    } catch (error) {
      alert(
        error.message || "Something went wrong while fetching inventory ❌"
      );
    }
  };

  useEffect(() => {
    if (userInfo?._id) {
      getCustomerList(userInfo?._id);
      getInventoryList(userInfo?._id);
    }
  }, [userInfo?._id]);
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
            element={
              <InvoiceGenerator
                userInfo={userInfo}
                customers={customers}
                itemList={itemList}
              />
            }
          />
          <Route
            path="add-customer"
            element={
              <Customer userInfo={userInfo} customersProps={customers} />
            }
          />
          <Route
            path="add-inventory"
            element={<Inventory userInfo={userInfo} />}
          />
          <Route
            path="invoice-history"
            element={<InvoiceHistory userInfo={userInfo} />}
          />
        </Routes>
      </div>
    </div>
  );
}
