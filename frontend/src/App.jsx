import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./hooks/useAuth";
import RoleSelector from "./components/common/RoleSelector";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Super Admin Pages
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import SubAdminDetails from "./pages/SuperAdmin/SubAdminDetails";
import AssignAluminum from "./pages/SuperAdmin/AssignAluminum";

// Sub Admin Pages
import SubAdminDashboard from "./pages/SubAdmin/Dashboard";
import Orders from "./pages/SubAdmin/Orders";
import UpdateSales from "./pages/SubAdmin/UpdateSales";
import NotifySoldOut from "./pages/SubAdmin/NotifySoldOut";

// Customer Pages
import Home from "./pages/Customer/Home";
import Cart from "./pages/Customer/Cart";
import Checkout from "./pages/Customer/Checkout";
import CustomerOrders from "./pages/Customer/Orders";

// Not Found
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import CreateSubAdmin from "./pages/SuperAdmin/CreateSubAdmin";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

export default function App() {
  const { user } = useAuth();
  // console.log(user);
  const navigate = useNavigate();

useEffect(() => {
    const allowedPaths = ["/login", "/register"];
    const currentPath = location.pathname;

    if (!user && !allowedPaths.includes(currentPath)) {
        navigate("/login");
    }
}, [user, navigate, location.pathname]);

  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" replace />;
    // if (role && user.role !== role) return <Navigate to="/" replace />;
    return children;
  };

  const handleRole = (selectedRole) => {
    // This function can be used to handle role selection globally if needed
    // console.log(`Selected role: ${selectedRole}`);
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Role Selector */}
        <Route path="/" element={<RoleSelector onRoleSelect={handleRole} />} />

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
