import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { SweetProvider } from "./contexts/SweetContext";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Sweets from "./pages/Sweets/Sweets";
import SweetDetails from "./pages/SweetDetails/SweetDetails";
import Cart from "./pages/Cart/Cart";
import Admin from "./pages/Admin/Admin";
import Profile from "./pages/Profile/Profile";

// Layout
import Layout from "./components/layout/Layout/Layout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SweetProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "white",
                color: "#333",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              },
            }}
          />
          
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="sweets" element={<Sweets />} />
              <Route path="sweets/:id" element={<SweetDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="admin" element={<Admin />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
            </Route>
          </Routes>
        </SweetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
