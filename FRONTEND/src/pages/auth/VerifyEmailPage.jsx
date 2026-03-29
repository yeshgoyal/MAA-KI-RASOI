import { useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FiCheckCircle, FiXCircle, FiMail } from 'react-icons/fi';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
  const [status, setStatus] = useState('pending'); // pending, loading, success, error
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const emailParam = query.get('email') || '';
  const [email, setEmail] = useState(emailParam);

  const handleChange = (index, value) => {
    // Only allow numbers and letters
    if (value && !/^[a-zA-Z0-9]+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).toUpperCase();
    if (!/^[A-Z0-9]+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    // Focus next empty or last
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex].focus();
  };

  const submitOtp = async (e) => {
    e?.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      return toast.error('Please enter the full 6-digit code');
    }
    if (!email) {
      return toast.error('Please enter your email address');
    }

    setStatus('loading');
    try {
      const { data } = await api.post('/users/verify-email', { email, otp: otpValue });
      setStatus('success');
      setMessage(data.message || 'Email verified successfully!');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Verification failed. Code may be expired.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#FFF8F0] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100 relative overflow-hidden">
        
        {/* Background blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-100 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

        {status === 'loading' && (
          <div className="py-8 relative z-10">
            <LoadingSpinner size="lg" className="mb-4 text-primary-500" />
            <h2 className="text-xl font-display font-bold">Verifying your email...</h2>
            <p className="text-gray-500 mt-2">Please wait a moment while we check your code.</p>
          </div>
        )}

        {status === 'pending' && (
          <div className="py-2 animate-slide-up relative z-10">
            <div className="w-20 h-20 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMail className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              We've sent a 6-digit verification code to your email address. Enter it below to activate your account.
            </p>

            <form onSubmit={submitOtp} className="space-y-6">
              {!emailParam && (
                <div>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Enter your email address"
                    className="w-full text-center py-3 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}

              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono text-primary-600 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  />
                ))}
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 shadow-md shadow-primary-500/20 transition-all transform hover:-translate-y-0.5"
              >
                Verify Account
              </button>
            </form>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8 animate-slide-up relative z-10">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Verified!</h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <Link to="/login" className="w-full block py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/20">
              Continue to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8 animate-slide-up relative z-10">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiXCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <button 
              onClick={() => { setStatus('pending'); setOtp(['', '', '', '', '', '']); inputRefs.current[0].focus(); }} 
              className="px-6 py-3 rounded-xl bg-primary-50 text-primary-600 font-bold hover:bg-primary-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
