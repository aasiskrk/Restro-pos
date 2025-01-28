import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import StaffManagement from './pages/admin/StaffManagement';
import MenuManagement from './pages/admin/MenuManagement';
import OrdersAndTables from './pages/admin/OrdersAndTables';
import Settings from './pages/admin/Settings';
import ServerInterface from './pages/server/ServerInterface';
import TablesAndOrders from './pages/server/TablesAndOrders';
import Menu from './pages/server/Menu';
import OrderHistory from './pages/server/OrderHistory';
import CashierInterface from './pages/cashier/CashierInterface';
import Checkout from './pages/cashier/Checkout';
import KitchenInterface from './pages/kitchen/KitchenInterface';
import InventoryAlert from './pages/kitchen/InventoryAlert';
import Signup from './pages/Signup';
import { ThemeProvider } from './context/ThemeContext';
import PaymentHistory from './pages/cashier/PaymentHistory';
import Profile from './pages/Profile';
import ProfileSettings from './pages/Settings';
import AdminSetup from './pages/AdminSetup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/staff" element={<StaffManagement />} />
          <Route path="/admin/menu" element={<MenuManagement />} />
          <Route path="/admin/orders" element={<OrdersAndTables />} />
          <Route path="/admin/settings" element={<Settings />} />

          {/* Role-based Routes */}
          <Route path="/server" element={<ServerInterface />} />
          <Route path="/server/tables" element={<TablesAndOrders />} />
          <Route path="/server/menu" element={<Menu />} />
          <Route path="/server/history" element={<OrderHistory />} />
          <Route path="/cashier" element={<CashierInterface />} />
          <Route path="/cashier/checkout" element={<Checkout />} />
          <Route path="/cashier/history" element={<PaymentHistory />} />
          <Route path="/kitchen" element={<KitchenInterface />} />
          <Route path="/kitchen/inventory" element={<InventoryAlert />} />

          {/* Common Routes (accessible by all roles) */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
}

export default App;
