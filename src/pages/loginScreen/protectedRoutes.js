import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");

  // Check if userId exists; if not, redirect to login
  return userId ? children : React.createElement(Navigate, { to: "/login" });
};

export default ProtectedRoute;
