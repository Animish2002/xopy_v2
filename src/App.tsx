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
import PrintFilesViewer from "./Dashboard/ViewPrints";
import EditPricing from "./Dashboard/EditPricing";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/signin" element={<Signup />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/preferences/:id" element={<Preferences />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AllUser />} />
          </Route>

          <Route element={<ShopownerRoute />}>
            <Route path="/shopowner/dashboard" element={<DashboardHome />} />
            <Route path="/shopowner/downloadQR" element={<DownloadQR />} />
            <Route path="/shopowner/add-pricing" element={<AddPricing />} />
            <Route path="/shopowner/view-pricing" element={<ViewPricing />} />
            <Route path="/shopowner/edit-pricing/:id" element={<EditPricing />} />
            <Route
              path="/shopowner/view-prints"
              element={<PrintFilesViewer />}
            />
            <Route path="/shopowner/setting" element={<Setting />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
