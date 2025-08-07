import React from "react";
import "./Header.css";
import invoiceIcon from "../../assets/icons/invoiceIcon.png";

const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={invoiceIcon} alt="Logo" className="logo" />
        <h1 className="app-title">Fast Billing App</h1>
      </div>

      <div className="header-right">
        <span className="user-name">{user.name}</span>
        <img src={user.avatar} alt="User Avatar" className="avatar" />
      </div>
    </header>
  );
};

export default Header;
