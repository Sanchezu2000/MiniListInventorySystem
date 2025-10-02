// src/pages/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // if no token, redirect to login
  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  return children; // ✅ allow access
};

export default ProtectedRoute;
