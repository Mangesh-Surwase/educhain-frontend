import React, { useState, useEffect, useRef } from 'react';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom'; // Navigation hooks
import { verifyOtp } from '../services/api'; // API import

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Register पेजवरून आलेला ईमेल मिळवा (जर डायरेक्ट पेज उघडलं तर fallback ठेवा)
  const email = location.state?.email || "your-email@example.com";

  // 1. OTP State (6 boxes)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60); // 60 seconds timer
  const inputRefs = useRef([]); // To manage focus

  // 2. Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Input Change Handler (Auto-focus next)
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Only numbers allowed

    const newOtp = [...otp];
    // Take only the last entered char
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // 4. Backspace Handler (Focus previous)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  // 5. Verify Action (Backend Connected)
  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    
    // Validation
    if (enteredOtp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    try {
      // --- API CALL ---
      await verifyOtp(email, enteredOtp);
      
      // Success
      toast.success("Email Verified Successfully! Please Login.");
      navigate('/login'); // Login पेजवर पाठवा

    } catch (error) {
      console.error("Verification Error:", error);
      // Backend कडून आलेला एरर मेसेज (उदा. "Invalid OTP" किंवा "OTP expired")
      const errorMsg = error.response?.data || "Verification failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  const handleResend = () => {
    if(timer === 0) {
        // टीप: इथे आपण नंतर 'resendOtp' API जोडू शकतो. सध्या फक्त टायमर रिसेट करत आहोत.
        setTimer(60);
        toast.success("Request sent to resend OTP!");
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-neon-blue rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-neon-purple rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

      {/* Main Glass Card */}
      <div className="relative w-full max-w-lg bg-dark-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-dark-700/50 p-10 text-center z-10">
        
        {/* Icon */}
        <div className="w-20 h-20 bg-dark-700/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-dark-600">
          <Mail size={32} className="text-neon-blue" />
        </div>

        {/* Text */}
        <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
        <p className="text-slate-400 mb-8">
          We have sent a 6-digit verification code to <span className="text-white font-medium">{email}</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-dark-900 border rounded-xl focus:outline-none transition-all ${
                digit 
                  ? 'border-neon-blue text-white shadow-lg shadow-neon-blue/20' 
                  : 'border-dark-700 text-slate-500 focus:border-neon-purple'
              }`}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button 
          onClick={handleVerify}
          className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-neon-blue/20 transform transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
        >
          Verify Account
          <CheckCircle size={22} />
        </button>

        {/* Resend Timer */}
        <div className="mt-8 text-slate-400 text-sm">
          Didn't receive the code? 
          {timer > 0 ? (
            <span className="ml-2 text-slate-500 font-mono">Resend in 00:{timer < 10 ? `0${timer}` : timer}</span>
          ) : (
            <button 
              onClick={handleResend}
              className="ml-2 text-neon-blue hover:text-white font-semibold underline-offset-4 hover:underline transition-all flex items-center justify-center gap-1 inline-flex"
            >
              <RefreshCw size={14} /> Resend Code
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OtpPage;