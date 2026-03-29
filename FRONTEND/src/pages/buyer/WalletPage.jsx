import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FiPlus, FiGift, FiCopy, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

const WalletPage = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(user?.wallet || 0);
  const [referralCode, setReferralCode] = useState(user?.referralCode || '');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await api.get('/users/wallet');
        setBalance(data.wallet);
        setReferralCode(data.referralCode);
      } catch (err) {
        console.error('Failed to load wallet data', err);
      }
    };
    fetchWallet();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const handleTopup = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return toast.error('Enter a valid amount');
    toast('Payment Gateway Integration Required', { icon: '🚧' });
    // Proceed to razorpay normally here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Maa Wallet</h1>
        <p className="text-gray-500 mt-2">Manage your balance and earn rewards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black opacity-10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <p className="text-primary-100 font-medium mb-2 opacity-90">Current Balance</p>
            <h2 className="text-5xl font-bold font-display tracking-tight mb-8">₹{balance.toFixed(2)}</h2>
            
            <form onSubmit={handleTopup} className="flex gap-2">
              <input 
                type="number" 
                placeholder="Enter amount" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button type="submit" className="bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors flex items-center justify-center">
                <FiPlus className="mr-1" /> Add
              </button>
            </form>
          </div>
        </div>

        {/* Rewards Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-accent-50 text-accent-500 rounded-2xl flex items-center justify-center text-xl mb-4">
              <FiGift />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Refer & Earn</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Share your referral code with friends. They get ₹100 off their first order, and you get ₹50 in your wallet when their order is delivered!
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200 border-dashed">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Code</p>
              <p className="font-mono text-lg font-bold text-primary-600 tracking-widest">{referralCode}</p>
            </div>
            <button 
              onClick={handleCopy}
              className="p-3 bg-white text-gray-600 rounded-lg shadow-sm border border-gray-100 hover:text-primary-600 hover:border-primary-200 transition-colors"
              title="Copy code"
            >
              <FiCopy />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiTrendingUp className="text-primary-500" /> Recent Transactions
        </h3>
        <div className="text-center py-10">
          <p className="text-gray-500">No recent transactions to show.</p>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
