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
import ProtectedRoute from "../src/pages/loginScreen/protectedRoutes";
import BannerPage from "./pages/content/bannerPage";
import DesignerRequests from "./pages/designer-Requests/designerRequests";
import BlogsPage from "./pages/blogs/blogsPage";
import ManageQueries from "./pages/manageQueries/manageQueries";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-right" autoClose={2500} />
      <Router>
        <GlobalStyles />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Loginscreen />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <BaseLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/products" element={<ManageProducts />} />
            <Route path="/designers" element={<ManageDesignerScreen />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/coupon" element={<CouponPage />} />
            <Route path="/category" element={<ManageCategories />} />
            <Route path="/video" element={<VideoContent />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/manage-queries" element={<ManageQueries />} />
            <Route path="/banner" element={<BannerPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/designer-requests" element={<DesignerRequests />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
