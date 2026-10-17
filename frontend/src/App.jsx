import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResidentDashboard from "./pages/dashboard/ResidentDashboard";
import GuardDashboard from "./pages/dashboard/GuardDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ResidentVisitors from "./pages/dashboard/ResidentVisitors";
import GuardVisitorEntry from "./pages/dashboard/GuardVisitorEntry";
import AdminResidents from "./pages/dashboard/AdminResidents";
import ResidentComplaints from "./pages/dashboard/ResidentComplaints";
import AdminComplaints from "./pages/dashboard/AdminComplaints";
import ResidentBilling from "./pages/dashboard/ResidentBilling";
import AdminBilling from "./pages/dashboard/AdminBilling";
// Step 6: Notice Board module ke pages
import ResidentNotices from "./pages/dashboard/ResidentNotices";
import AdminNotices from "./pages/dashboard/AdminNotices";
// Step 7: Events Management module ke pages
import ResidentEvents from "./pages/dashboard/ResidentEvents";
import AdminEvents from "./pages/dashboard/AdminEvents";
// Step 8: Parking Management module ke pages
import ResidentParking from "./pages/dashboard/ResidentParking";
import AdminParking from "./pages/dashboard/AdminParking";
// Step 9: Marketplace module ke pages
import ResidentMarketplace from "./pages/dashboard/ResidentMarketplace";
import AdminMarketplace from "./pages/dashboard/AdminMarketplace";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard/resident" element={<ProtectedRoute allowedRoles={["resident"]}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<ResidentDashboard />} />
            <Route path="visitors" element={<ResidentVisitors />} />
            <Route path="complaints" element={<ResidentComplaints />} />
            <Route path="billing" element={<ResidentBilling />} />
            {/* Step 6: Resident sirf notices dekh sakta hai, post nahi kar sakta */}
            <Route path="notices" element={<ResidentNotices />} />
            {/* Step 7: Resident events dekh sakta hai aur register/cancel kar sakta hai */}
            <Route path="events" element={<ResidentEvents />} />
            {/* Step 8: Resident apni gaadi register kare, slot dekhe */}
            <Route path="parking" element={<ResidentParking />} />
            {/* Step 9: Resident shop kare, cart/checkout kare, orders track kare */}
            <Route path="marketplace" element={<ResidentMarketplace />} />
          </Route>

          <Route path="/dashboard/guard" element={<ProtectedRoute allowedRoles={["guard"]}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<GuardDashboard />} />
            <Route path="visitor-entry" element={<GuardVisitorEntry />} />
          </Route>

          <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={["admin"]}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="residents" element={<AdminResidents />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="billing" element={<AdminBilling />} />
            {/* Step 6: Admin notices post/delete kar sakta hai */}
            <Route path="notices" element={<AdminNotices />} />
            {/* Step 7: Admin events create/delete kar sakta hai */}
            <Route path="events" element={<AdminEvents />} />
            {/* Step 8: Admin total slots set kare, gaadiyan dekhe, slot assign kare */}
            <Route path="parking" element={<AdminParking />} />
            {/* Step 9: Admin products manage kare, order status update kare */}
            <Route path="marketplace" element={<AdminMarketplace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
