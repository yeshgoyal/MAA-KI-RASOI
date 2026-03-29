import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1A1208] text-[#F4EBE1] py-12 border-t border-[#3D352F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-display font-bold text-white tracking-tight">MaaKeHaath<span className="text-secondary-400">KaKhana</span></span>
              <span className="text-xl">🍲</span>
            </Link>
            <p className="text-gray-400 max-w-sm">
              Connecting students and professionals with loving home cooks, delivering warmth and nostalgia in every meal.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Explore</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/explore" className="hover:text-primary-400 transition-colors">Browse Cooks</Link></li>
              <li><Link to="/popular" className="hover:text-primary-400 transition-colors">Popular Dishes</Link></li>
              <li><Link to="/register?role=cook" className="hover:text-primary-400 transition-colors">Become a Cook</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">Our Story</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#3D352F] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} MaaKeHaathKaKhana. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
