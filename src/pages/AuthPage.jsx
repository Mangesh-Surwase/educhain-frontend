import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, BookOpen, CheckCircle, Presentation, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast'; 
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/api';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState('LEARNER');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 chars";
      isValid = false;
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await loginUser({
            email: formData.email,
            password: formData.password
        });
        
        const data = response.data; 

        // 🔥 Save Data to LocalStorage
        localStorage.setItem('token', data.token); 
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', data.firstName);
        localStorage.setItem('userRole', data.role);
        
        // 🔥🔥 NEW: Save Profile Image if exists
        if (data.profileImage) {
            localStorage.setItem('userImage', data.profileImage);
        } else {
            localStorage.removeItem('userImage'); // Clear old if none
        }

        toast.success("Login Successful!");
        navigate('/dashboard'); 

      } else {
        await registerUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: selectedRole
        });

        toast.success("Registration Successful! Please verify OTP.");
        navigate('/otp', { state: { email: formData.email } }); 
      }
    } catch (error) {
      console.error("API Error:", error);
      const errorMsg = error.response?.data || "Something went wrong! Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-blue rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-purple rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative w-full max-w-5xl bg-dark-800/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10 z-10 animate-scaleIn">
        
        {/* Left Side (Info) */}
        <div className="w-full md:w-1/2 p-12 bg-gradient-to-br from-neon-blue/10 to-dark-900/60 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10 animate-slideRight">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-xl shadow-lg shadow-neon-blue/30">
                <BookOpen size={28} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">EduChain</h1>
            </div>
            <h2 className="text-5xl font-extrabold mb-6 leading-tight">
              {isLogin ? <span className="animate-fadeIn">Welcome <br/>Back!</span> : <span className="animate-fadeIn">Join the <br/>Revolution.</span>}
            </h2>
            <p className="text-slate-300 text-xl max-w-sm">
              {isLogin ? "Connect, learn, and grow with your personal mentor today." : "Exchange skills, earn credits, and master new technologies."}
            </p>
          </div>
          
          <div className="mt-12 space-y-5 relative z-10 animate-slideUp delay-200">
             <div className="flex items-center gap-4 text-slate-200 text-lg group">
                <CheckCircle className="text-neon-blue drop-shadow-glow group-hover:scale-110 transition-transform" size={24} />
                <span className="font-medium group-hover:text-white transition-colors">One-on-one Mentorship</span>
             </div>
             <div className="flex items-center gap-4 text-slate-200 text-lg group">
                <CheckCircle className="text-neon-purple drop-shadow-glow group-hover:scale-110 transition-transform" size={24} />
                <span className="font-medium group-hover:text-white transition-colors">Skill-based Credits</span>
             </div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-12 bg-dark-900/80 flex flex-col justify-center border-l border-white/5">
          
          <div className="flex justify-between items-center mb-10 animate-fadeIn">
            <div>
                <h3 className="text-3xl font-bold text-white mb-2">{isLogin ? "Sign In" : "Create Account"}</h3>
                <p className="text-slate-400">{isLogin ? "Continue your journey" : "Get started for free"}</p>
            </div>
            <div className="bg-dark-800 p-1 rounded-full flex items-center border border-dark-700 shadow-inner">
                <button type="button" onClick={() => setIsLogin(true)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isLogin ? 'bg-neon-blue text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Login</button>
                <button type="button" onClick={() => setIsLogin(false)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isLogin ? 'bg-neon-blue text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Sign Up</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn delay-100">
            {!isLogin && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full group">
                  <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-neon-blue transition-colors" size={20} />
                  <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="First Name" className={`w-full bg-dark-800 text-white border rounded-xl py-4 pl-12 focus:outline-none focus:ring-1 transition-all placeholder:text-slate-500 ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-dark-700 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,243,255,0.2)]'}`} />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>}
                </div>
                <div className="relative w-full group">
                  <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-neon-blue transition-colors" size={20} />
                  <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Last Name" className={`w-full bg-dark-800 text-white border rounded-xl py-4 pl-12 focus:outline-none focus:ring-1 transition-all placeholder:text-slate-500 ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-dark-700 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,243,255,0.2)]'}`} />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>}
                </div>
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-neon-blue transition-colors" size={20} />
              <input name="email" value={formData.email} onChange={handleChange} type="text" placeholder="Email Address" className={`w-full bg-dark-800 text-white border rounded-xl py-4 pl-12 focus:outline-none focus:ring-1 transition-all placeholder:text-slate-500 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-dark-700 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,243,255,0.2)]'}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-neon-blue transition-colors" size={20} />
              <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" className={`w-full bg-dark-800 text-white border rounded-xl py-4 pl-12 focus:outline-none focus:ring-1 transition-all placeholder:text-slate-500 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-dark-700 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,243,255,0.2)]'}`} />
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            {isLogin && (
                <div className="text-right">
                    <span onClick={() => navigate('/forgot-password')} className="text-sm text-slate-400 hover:text-neon-blue cursor-pointer transition-colors hover:underline underline-offset-4">
                        Forgot Password?
                    </span>
                </div>
            )}

            {!isLogin && (
              <div className="space-y-3 animate-fadeIn">
                  <label className="text-slate-300 font-medium ml-1">Select Your Role</label>
                  <div className="flex gap-4">
                      <div onClick={() => setSelectedRole('LEARNER')} className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 ${selectedRole === 'LEARNER' ? 'border-neon-blue bg-neon-blue/10 shadow-lg shadow-neon-blue/20' : 'border-dark-700 bg-dark-800 hover:border-slate-600'}`}>
                          <BookOpen size={32} className={selectedRole === 'LEARNER' ? 'text-neon-blue' : 'text-slate-400'} />
                          <div className="text-center"><h4 className={`font-bold ${selectedRole === 'LEARNER' ? 'text-white' : 'text-slate-300'}`}>Learner</h4><p className="text-xs text-slate-400">I want to learn skills.</p></div>
                      </div>
                      <div onClick={() => setSelectedRole('MENTOR')} className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 ${selectedRole === 'MENTOR' ? 'border-neon-purple bg-neon-purple/10 shadow-lg shadow-neon-purple/20' : 'border-dark-700 bg-dark-800 hover:border-slate-600'}`}>
                          <Presentation size={32} className={selectedRole === 'MENTOR' ? 'text-neon-purple' : 'text-slate-400'} />
                          <div className="text-center"><h4 className={`font-bold ${selectedRole === 'MENTOR' ? 'text-white' : 'text-slate-300'}`}>Mentor</h4><p className="text-xs text-slate-400">I want to share knowledge.</p></div>
                      </div>
                  </div>
              </div>
            )}

            <button 
                type="submit" 
                disabled={isLoading} 
                className={`w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-neon-blue/20 transform transition-all active:scale-95 flex items-center justify-center gap-2 text-lg mt-8 hover:shadow-neon-blue/40 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                    <Loader2 className="animate-spin" size={22} />
                    Processing...
                </>
              ) : (
                <>
                    {isLogin ? "Login Now" : "Create Account"}
                    <ArrowRight size={22} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              {isLogin ? "New to EduChain?" : "Already a member?"}
              <button type="button" onClick={() => { setIsLogin(!isLogin); setErrors({}); setFormData({firstName: '', lastName: '', email: '', password: ''}); }} className="ml-2 text-neon-blue hover:text-blue-300 font-semibold underline-offset-4 hover:underline transition-all">
                {isLogin ? "Create an account" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }

        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }

        @keyframes slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideRight { animation: slideRight 0.6s ease-out forwards; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
};

export default AuthPage;