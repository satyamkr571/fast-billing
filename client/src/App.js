import "./App.css";
import Header from "./components/header/Header";
import profileIcon from "../src/assets/icons/profileIcon.jpg";
import { useEffect, useState } from "react";
import Login from "./components/login/Login";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      setUserInfo(data?.user);
      setIsAuthenticated(true);

      const expiryTime = Date.now() + 60 * 60 * 1000;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: data.user,
          token: data.token,
          expiry: expiryTime,
        })
      );
    } catch (error) {
      alert(error.message || "Something went wrong. Please try again.");
    }
  };
  const handleLogout = () => {
    setUserInfo(null);
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const { user, expiry } = JSON.parse(storedAuth);

      if (Date.now() < expiry) {
        setUserInfo(user);
        setIsAuthenticated(true);

        const timeout = expiry - Date.now();
        const timer = setTimeout(() => handleLogout(), timeout);
        return () => clearTimeout(timer);
      } else {
        localStorage.removeItem("auth");
      }
    }
  }, []);

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <div className="App">
          <Header
            user={{ name: userInfo?.supplierName, avatar: profileIcon }}
            handleLogout={handleLogout}
          />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/" />} />
              <Route
                path="/dashboard/*"
                element={<Dashboard userInfo={userInfo} />}
              />
            </Routes>
          </BrowserRouter>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
