import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import StaffManagement from './pages/admin/StaffManagement';
import MenuManagement from './pages/admin/MenuManagement';
import OrdersAndTables from './pages/admin/OrdersAndTables';
import Inventory from './pages/admin/Inventory';
import Settings from './pages/admin/Settings';
import ServerInterface from './pages/server/ServerInterface';
import TablesAndOrders from './pages/server/TablesAndOrders';
import Menu from './pages/server/Menu';
import OrderHistory from './pages/server/OrderHistory';
import CashierInterface from './pages/cashier/CashierInterface';
import Checkout from './pages/cashier/Checkout';
import KitchenInterface from './pages/kitchen/KitchenInterface';
import Signup from './pages/Signup';
import { ThemeProvider } from './context/ThemeContext';
import PaymentHistory from './pages/cashier/PaymentHistory';
import InventoryAlert from './pages/kitchen/InventoryAlert';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/staff" element={<StaffManagement />} />
          <Route path="/admin/menu" element={<MenuManagement />} />
          <Route path="/admin/orders" element={<OrdersAndTables />} />
          <Route path="/admin/inventory" element={<Inventory />} />
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
