import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/global/GlobalStyles";
import Loginscreen from "./pages/loginScreen/LoginScreen";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import BaseLayout from "./components/layout/BaseLayout";
import { theme } from "./styles/theme/theme";
import DashboardScreen from "./pages/dashboard/DashboardScreen";
import ManageProducts from "./pages/manageProductsScreen/manageProducts";
import ManageDesignerScreen from "./pages/manageDesigners/manageDesignerScreen";
import UserPage from "./pages/userPage/userPage";
import PaymentPage from "./pages/paymentPage/paymentPage";
import CouponPage from "./pages/couponPage/couponPage";
import ManageCategories from "./pages/manageCategories/manageCategories";
import VideoContent from "./pages/videoContent/videoContent";
import NotificationPage from "./pages/notifications/notificationPage";

// ProtectedRoute Component
const ProtectedRoute = ({ isLoggedIn }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-right" autoClose={2500} />
      <Router>
        <GlobalStyles />
        <Routes>
          {/* Redirect root path to login or dashboard */}
          <Route
            path="/"
            element={
              <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
            }
          />

          {/* Public Route */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Loginscreen />
              )
            }
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            <Route element={<BaseLayout />}>
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/products" element={<ManageProducts />} />
              <Route path="/designers" element={<ManageDesignerScreen />} />
              <Route path="/users" element={<UserPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/coupon" element={<CouponPage />} />
              <Route path="/category" element={<ManageCategories />} />
              <Route path="/video" element={<VideoContent />} />
              <Route path="/notification" element={<NotificationPage />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
