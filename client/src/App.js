import "./App.css";
import Header from "./components/header/Header";
import InvoiceGenerator from "./components/invoice/Invoice";
import profileIcon from "../src/assets/icons/profileIcon.jpg";
import { useState } from "react";
import Login from "./components/login/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Login failed");
        return;
      }
      const data = await response.json();
      setUserInfo(data?.user);
      console.log("✅ Login success:", data);

      // Example: store user info in state/localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsAuthenticated(true);
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <div className="App">
          <Header
            user={{ name: userInfo?.supplierName, avatar: profileIcon }}
          />
          <Dashboard />
          {/* <InvoiceGenerator /> */}
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
