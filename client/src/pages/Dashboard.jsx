import React from "react";
import "./Dashboard.css";

const cards = [
  { title: "Create New Invoice", color: "#4CAF50" },
  { title: "Add New Customer", color: "#2196F3" },
  { title: "Add New Inventory", color: "#FF9800" },
  { title: "Invoice History", color: "#9C27B0" },
  { title: "Customer & Inventory List", color: "#F44336" },
];

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {cards.map((card, index) => (
        <div
          key={index}
          className="dashboard-card"
          style={{ backgroundColor: card.color }}>
          <h3>{card.title}</h3>
        </div>
      ))}
    </div>
  );
}
