import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './Components/layout/PublicLayout';
import DashboardLayout from './Components/layout/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import CookProfilePage from './pages/CookProfilePage';
import CartPage from './pages/CartPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import MyOrders from './pages/buyer/MyOrders';
import OrderDetail from './pages/buyer/OrderDetail';
import WalletPage from './pages/buyer/WalletPage';
import ProfileSettings from './pages/buyer/ProfileSettings';
import { Subscriptions, FavoriteCooks } from './pages/buyer/SubscriptionsFavorites';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import IncomingOrders from './pages/seller/IncomingOrders';
import ManageMenu from './pages/seller/ManageMenu';
import SellerProfile from './pages/seller/SellerProfile';
import { EarningsPage, ReviewsPage } from './pages/seller/EarningsReviews';


// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

const CookRoute = ({ children }) => {
  const { isCook, loading } = useAuth();
  if (loading) return null;
  if (!isCook) return <Navigate to="/buyer/dashboard" />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/cooks/:id" element={<CookProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Buyer Dashboard Routes (Includes Sidebar) */}
      <Route path="/buyer" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/buyer/dashboard" replace />} />
        <Route path="dashboard" element={<BuyerDashboard />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="favorites" element={<FavoriteCooks />} />
      </Route>

      {/* Seller Dashboard Routes (Cook Access Only) */}
      <Route path="/seller" element={<ProtectedRoute><CookRoute><DashboardLayout /></CookRoute></ProtectedRoute>}>
        <Route index element={<Navigate to="/seller/dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="orders" element={<IncomingOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="menu" element={<ManageMenu />} />
        <Route path="profile" element={<SellerProfile />} />
        <Route path="earnings" element={<EarningsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
