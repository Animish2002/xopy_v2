import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardHome from "./Dashboard/DashboardHome";
import { AuthProvider } from "./utils/AuthContext";
import { AdminRoute, ShopownerRoute } from "./utils/ProtectedRoute";
import Signup from "./Auth/Login";
import Register from "./Auth/Register";
import Preferences from "./EndUser/Preferences";
import DownloadQR from "./Dashboard/DownloadQR";
import Setting from "./Dashboard/Setting";
import AddPricing from "./Dashboard/Add-Pricing";
import Home from "./Landing/Home";
import ViewPricing from "./Dashboard/ViewPricing";
import AllUser from "./Admin/AllUser";
import PageNotFound from "./PageNotFound";
import PrintFilesViewer from "./Dashboard/PrintFilesViewer";
import EditPricing from "./Dashboard/EditPricing";
import Dashboard from "./Admin/Dashboard";
import { SocketProvider } from "./context/SocketContext";
import SettingAdminPage from "./Admin/SettingAdminPage";
import ShopManagment from "./Admin/ShopManagment";
import Analytics from "./Admin/Analytics";
import PrintReports from "./Admin/PrintReports";
import Settings from "./Admin/Settings";
import ContactSupport from "./Dashboard/ContactSupport";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/signin" element={<Signup />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/preferences/:id" element={<Preferences />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/shops" element={<ShopManagment />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/print-reports" element={<PrintReports />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/profile" element={<SettingAdminPage />} />
              <Route path="/admin/users" element={<AllUser />} />
            </Route>

            <Route element={<ShopownerRoute />}>
              <Route path="/shopowner/dashboard" element={<DashboardHome />} />
              <Route path="/shopowner/downloadQR" element={<DownloadQR />} />
              <Route path="/shopowner/add-pricing" element={<AddPricing />} />
              <Route path="/shopowner/view-pricing" element={<ViewPricing />} />
              <Route
                path="/shopowner/edit-pricing/:id"
                element={<EditPricing />}
              />
              <Route
                path="/shopowner/view-prints"
                element={<PrintFilesViewer />}
              />
              <Route path="/shopowner/profile" element={<Setting />} />
              <Route
                path="/shopowner/contact-support"
                element={<ContactSupport />}
              />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
