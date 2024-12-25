import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import StaffManagement from './pages/admin/StaffManagement';
import MenuManagement from './pages/admin/MenuManagement';
import OrdersAndTables from './pages/admin/OrdersAndTables';
import Inventory from './pages/admin/Inventory';
import ServerInterface from './pages/server/ServerInterface';
import CashierInterface from './pages/cashier/CashierInterface';
import KitchenInterface from './pages/kitchen/KitchenInterface';
import Signup from './pages/Signup';

function App() {
  return (
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

        {/* Role-based Routes */}
        <Route path="/server" element={<ServerInterface />} />
        <Route path="/cashier" element={<CashierInterface />} />
        <Route path="/kitchen" element={<KitchenInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
