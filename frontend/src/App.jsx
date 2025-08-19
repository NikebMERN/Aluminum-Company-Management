import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./hooks/useAuth";
import RoleSelector from "./components/common/RoleSelector";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Super Admin Pages
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import SubAdminDetails from "./pages/SuperAdmin/SubAdminDetails";
import AssignAluminum from "./pages/SuperAdmin/AssignAluminum";
import CreateSubAdmin from "./pages/SuperAdmin/CreateSubAdmin";
import CreateStockRequest from "./pages/SuperAdmin/CreateStockRequest";
import CompareQuotations from "./pages/SuperAdmin/CompareQuotations";

// Sub Admin Pages
import SubAdminDashboard from "./pages/SubAdmin/Dashboard";
import Orders from "./pages/SubAdmin/Orders";
import UpdateSales from "./pages/SubAdmin/UpdateSales";
import NotifySoldOut from "./pages/SubAdmin/NotifySoldOut";
import AssignedRequests from "./pages/SubAdmin/AssignedRequests";
import SubmitQuotation from "./pages/SubAdmin/SubmitQuotation";

// Customer Pages
import Home from "./pages/Customer/Home";
import Cart from "./pages/Customer/Cart";
import Checkout from "./pages/Customer/Checkout";
import CustomerOrders from "./pages/Customer/Orders";

// Layouts & Not Found
import NotFound from "./pages/NotFound";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

import { useEffect } from "react";
import UseStockItem from "./pages/SubAdmin/UseStockItem";
// import StockRequestDetails from "./pages/SuperAdmin/StockRequestDetails";

export default function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Correct way

  useEffect(() => {
    const allowedPaths = ["/login", "/register"];
    const currentPath = location.pathname;

    if (!user && !allowedPaths.includes(currentPath)) {
      navigate("/login");
    }
  }, [user, navigate, location.pathname]);

  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Role Selector */}
        <Route path="/" element={<RoleSelector />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Super Admin Routes */}
        <Route
          path="/super_admin"
          element={
            <ProtectedRoute role="super_admin">
              <Header />
              <SuperAdminDashboard />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/:id"
          element={
            <ProtectedRoute role="super_admin">
              <Header />
              <SubAdminDetails />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/assign"
          element={
            <ProtectedRoute role="super_admin">
              <Header />
              <AssignAluminum />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/create-subadmin"
          element={
            <ProtectedRoute role="super_admin">
              <Header />
              <CreateSubAdmin />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/create-stock-request"
          element={
            <ProtectedRoute role="super_admin">
              <Header />
              <CreateStockRequest />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super_admin/compare-quotations/:requestId"
          element={
            <ProtectedRoute role="super_admin">
              <Header />
              <CompareQuotations />
              <Footer />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/super_admin/stock-requests:id"
          element={
            <ProtectedRoute role="super_admin">
              <Header />
              <StockRequestDetails />
              <Footer />
            </ProtectedRoute>
          }
        /> */}

        {/* Sub Admin Routes */}
        <Route
          path="/sub_admin"
          element={
            <ProtectedRoute role="sub_admin">
              <Header />
              <SubAdminDashboard />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sub_admin/orders"
          element={
            <ProtectedRoute role="sub_admin">
              <Header />
              <Orders />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sub_admin/update-sales"
          element={
            <ProtectedRoute role="sub_admin">
              <Header />
              <UpdateSales />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sub_admin/notify-soldout"
          element={
            <ProtectedRoute role="sub_admin">
              <Header />
              <NotifySoldOut />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sub_admin/assigned-requests"
          element={
            <ProtectedRoute role="sub_admin">
              <Header />
              <AssignedRequests />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sub_admin/submit-quotation/:id/:subid"
          element={
            <ProtectedRoute role="sub_admin">
              <Header />
              <SubmitQuotation />
              <Footer />
            </ProtectedRoute>
          }
        />
          <Route
          path="/sub_admin/use-stock"
          element={
            <ProtectedRoute role="sub_admin">
              <Header />
              <UseStockItem />
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="customer">
              <Header />
              <Home />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/cart"
          element={
            <ProtectedRoute role="customer">
              <Header />
              <Cart />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/checkout"
          element={
            <ProtectedRoute role="customer">
              <Header />
              <Checkout />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders"
          element={
            <ProtectedRoute role="customer">
              <Header />
              <CustomerOrders />
              <Footer />
            </ProtectedRoute>
          }
        />
        

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
