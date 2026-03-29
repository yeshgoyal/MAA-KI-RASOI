import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiMenu, FiX, FiUser, FiShoppingCart } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout, isCook } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-primary-500 tracking-tight">MaaKeHaath<span className="text-secondary-500">KaKhana</span></span>
            <span className="text-xl">🍲</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-gray-600 hover:text-primary-500 font-medium transition-colors">
                {link.name}
              </Link>
            ))}

            <Link to="/cart" className="relative text-gray-600 hover:text-primary-500 transition-colors flex items-center">
              <FiShoppingCart className="w-5 h-5" />
              {cart?.items?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to={isCook ? "/seller/dashboard" : "/buyer/dashboard"} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors font-medium">
                  <FiUser /> Dashboard
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 font-medium transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 font-medium hover:text-primary-500 transition-colors">Log in</Link>
                <Link to="/register" className="px-5 py-2.5 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary-500 focus:outline-none"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-slide-up">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-500 hover:bg-primary-50"
              >
                {link.name}
              </Link>
            ))}
            
            <Link 
              to="/cart" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-500 hover:bg-primary-50"
            >
              <FiShoppingCart /> Cart {cart?.items?.length > 0 && `(${cart.items.length})`}
            </Link>

            <div className="border-t border-gray-100 my-4 pt-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to={isCook ? "/seller/dashboard" : "/buyer/dashboard"}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 bg-primary-50"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="mt-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 px-3">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium">Log in</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 rounded-lg bg-primary-500 text-white font-medium">Sign up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
