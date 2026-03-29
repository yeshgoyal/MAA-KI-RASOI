import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiShoppingBag, FiUser, FiSettings, FiLogOut, FiMenu, FiX, FiPieChart, FiDollarSign, FiClock, FiStar, FiCalendar } from 'react-icons/fi';
import { useState } from 'react';

const DashboardLayout = () => {
  const { user, logout, isCook } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const buyerLinks = [
    { name: 'Overview', path: '/buyer/dashboard', icon: FiHome },
    { name: 'My Orders', path: '/buyer/orders', icon: FiShoppingBag },
    { name: 'Subscriptions', path: '/buyer/subscriptions', icon: FiCalendar },
    { name: 'Wallet', path: '/buyer/wallet', icon: FiDollarSign },
    { name: 'Profile', path: '/buyer/profile', icon: FiUser },
  ];

  const sellerLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: FiPieChart },
    { name: 'Incoming Orders', path: '/seller/orders', icon: FiClock },
    { name: 'Manage Menu', path: '/seller/menu', icon: FiShoppingBag },
    { name: 'Earnings', path: '/seller/earnings', icon: FiDollarSign },
    { name: 'Reviews', path: '/seller/reviews', icon: FiStar },
    { name: 'Profile', path: '/seller/profile', icon: FiUser },
  ];

  const links = isCook ? sellerLinks : buyerLinks;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <span className="text-xl font-bold text-primary-500 font-display tracking-tight">MaaKeHaath</span>
          <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(false)}>
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold overflow-hidden">
              {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800 leading-tight">{user?.name}</p>
              <p className="text-xs text-gray-500">{isCook ? 'Chef' : 'Foodie'}</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <link.icon className={`mr-3 h-5 w-5`} />
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 lg:hidden">
          <button className="text-gray-500 focus:outline-none focus:text-gray-700" onClick={() => setSidebarOpen(true)}>
            <FiMenu className="w-6 h-6" />
          </button>
          <span className="text-xl font-bold text-primary-500 font-display">MaaKeHaath</span>
          <div className="w-6"></div> {/* Spacer for centering */}
        </header>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-[#FFF8F0]/30 custom-scrollbar">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
