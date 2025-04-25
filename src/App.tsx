import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardHome from "./Dashboard/DashboardHome";
import { AuthProvider } from "./utils/AuthContext";
import Signup from "./Auth/Login";
import Register from "./Auth/Register";
import Layout from "./Dashboard/Layout";
import Preferences from "./EndUser/Preferences";
import DownloadQR from "./Dashboard/DownloadQR";
import Setting from "./Dashboard/Setting";
import AddPricing from "./Dashboard/Add-Pricing";
import ViewPrints from "./Dashboard/ViewPrints";
import Home from "./Landing/Home";
import ViewPricing from "./Dashboard/ViewPricing";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<Signup />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Layout />} />
          <Route path="/preferences/:id" element={<Preferences />} />
          <Route path="/dashboard-home" element={<DashboardHome />} />
          <Route path="/downloadQR" element={<DownloadQR />} />
          <Route path="/add-pricing" element={<AddPricing />} />
          <Route path="/view-pricing" element={<ViewPricing />} />
          <Route path="/view-prints" element={<ViewPrints />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
