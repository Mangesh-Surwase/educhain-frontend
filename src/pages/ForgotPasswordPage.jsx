import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, KeyRound, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast'; 
import { useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/api';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");
        
        setIsLoading(true);
        try {
            await forgotPassword(email);
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data || "Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) return toast.error("All fields are required");

        setIsLoading(true);
        try {
            await resetPassword({ email, otp, newPassword });
            toast.success("Password Reset Successfully!");
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-purple rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>

            <div className="relative w-full max-w-md bg-dark-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-dark-700/50">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-neon-blue/20">
                        <KeyRound size={32} className="text-white"/>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-slate-400 text-sm">
                        {step === 1 ? "Enter your email to receive an OTP." : "Enter the OTP sent to your email."}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="relative">
                            <Mail className="absolute left-4 top-4 text-slate-500" size={20} />
                            <input 
                                value={email} onChange={(e) => setEmail(e.target.value)} 
                                type="email" placeholder="Email Address" 
                                className="w-full bg-dark-800 text-white border border-dark-700 rounded-xl py-4 pl-12 focus:outline-none focus:border-neon-blue transition-all" 
                            />
                        </div>
                        <button disabled={isLoading} className="w-full bg-neon-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin"/> : <>Send OTP <ArrowRight size={20}/></>}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6 animate-fadeIn">
                        <div className="relative">
                            <CheckCircle className="absolute left-4 top-4 text-slate-500" size={20} />
                            <input 
                                value={otp} onChange={(e) => setOtp(e.target.value)} 
                                type="text" placeholder="Enter OTP" 
                                className="w-full bg-dark-800 text-white border border-dark-700 rounded-xl py-4 pl-12 focus:outline-none focus:border-neon-blue transition-all tracking-widest text-lg" 
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-4 text-slate-500" size={20} />
                            <input 
                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                                type="password" placeholder="New Password" 
                                className="w-full bg-dark-800 text-white border border-dark-700 rounded-xl py-4 pl-12 focus:outline-none focus:border-neon-blue transition-all" 
                            />
                        </div>
                        <button disabled={isLoading} className="w-full bg-neon-purple hover:bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin"/> : <>Reset Password <ArrowRight size={20}/></>}
                        </button>
                    </form>
                )}
                
                <div className="mt-6 text-center">
                    <span onClick={() => navigate('/login')} className="text-sm text-slate-400 hover:text-white cursor-pointer transition-colors">
                        Back to Login
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;