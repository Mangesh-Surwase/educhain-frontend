import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Zap, Clock, Trophy, Calendar, Search, ArrowRight, User, Star, Activity, Bell, Check, X } from 'lucide-react';
import { getDashboardStats, getNotifications, markNotificationRead } from '../services/api'; 
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔥 Updated State: Name + Image
  const [userInfo, setUserInfo] = useState({ name: 'User', image: null }); 
  
  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    // 🔥 Get User Details from LocalStorage
    const storedName = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const storedImage = localStorage.getItem('userImage'); // फोटो मिळवला

    setUserInfo({ 
        name: storedName || (email ? email.split('@')[0] : 'Friend'),
        image: storedImage // स्टेट सेट केली
    });

    fetchData();

    // Close dropdown when clicking outside
    function handleClickOutside(event) {
        if (notifRef.current && !notifRef.current.contains(event.target)) {
            setShowNotifs(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
        const [statsRes, notifRes] = await Promise.all([
            getDashboardStats(),
            getNotifications()
        ]);
        
        setStats(statsRes.data);
        setNotifications(notifRes.data);
        
        const unread = notifRes.data.filter(n => !n.read).length;
        setUnreadCount(unread);

    } catch (error) {
        console.error("Failed to load data", error);
    } finally {
        setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
        await markNotificationRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
        console.error("Failed to mark read");
    }
  };

  const handleJoinMeeting = (link) => {
    window.open(link, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex text-white font-sans">
        <Sidebar />
        <div className="flex-1 ml-64 flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex text-white font-sans overflow-hidden">
      
      {/* 1. Sidebar */}
      <Sidebar />

      {/* 2. Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-black relative">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* --- Header Section --- */}
        <header className="flex justify-between items-center mb-10 relative z-20 animate-slideDown">
            <div>
                <h1 className="text-4xl font-extrabold capitalize tracking-tight">
                    Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-400 animate-text-shimmer bg-[length:200%_auto]">{userInfo.name}</span>! 👋
                </h1>
                <p className="text-slate-400 mt-2 text-lg">Here's what's happening in your network today.</p>
            </div>
            
            <div className="flex items-center gap-6" ref={notifRef}>
                
                {/* Notification Bell */}
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifs(!showNotifs)} 
                        className={`p-3 rounded-full transition-all border transform active:scale-95 ${showNotifs ? 'bg-white/10 border-neon-blue text-white shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/30'}`}
                    >
                        <Bell size={22} className={unreadCount > 0 ? "animate-swing" : ""} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-dark-900 animate-ping"></span>
                        )}
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-dark-900"></span>
                        )}
                    </button>

                    {/* Dropdown */}
                    {showNotifs && (
                        <div className="absolute right-0 top-14 w-96 bg-dark-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeInOriginTop">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="font-bold text-white">Notifications</h3>
                                <span className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded-full border border-neon-blue/20">{unreadCount} New</span>
                            </div>
                            
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div 
                                            key={notif.id} 
                                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-all flex gap-3 ${!notif.read ? 'bg-neon-blue/5 border-l-2 border-l-neon-blue' : ''}`}
                                        >
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-neon-blue shadow-[0_0_8px_rgba(0,243,255,0.8)]' : 'bg-slate-600'}`}></div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${!notif.read ? 'text-white font-medium' : 'text-slate-400'}`}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-slate-500 mt-1">
                                                    {new Date(notif.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notif.read && (
                                                <button onClick={() => handleMarkRead(notif.id)} className="text-slate-500 hover:text-neon-blue transition-colors p-1 hover:bg-neon-blue/10 rounded" title="Mark as read">
                                                    <Check size={16}/>
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-500">
                                        <Bell size={32} className="mx-auto mb-2 opacity-20"/>
                                        <p>No notifications yet.</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-white/5 text-center border-t border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                <button className="text-xs text-slate-400 hover:text-white transition-colors">View All History</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 🔥🔥🔥 UPDATED PROFILE IMAGE SECTION 🔥🔥🔥 */}
                <div onClick={() => navigate('/profile')} className="cursor-pointer group relative">
                    {userInfo.image ? (
                        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-neon-blue to-purple-600 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all duration-300">
                            <img 
                                src={userInfo.image} 
                                alt="Profile" 
                                className="w-full h-full rounded-full object-cover border-2 border-dark-900"
                            />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-purple-600 flex items-center justify-center font-bold text-white border-2 border-white/10 shadow-lg hover:scale-110 transition-transform hover:shadow-neon-blue/40">
                            {userInfo.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

            </div>
        </header>

        {/* --- Stats Widgets Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            
            {/* Widget 1: Rating */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300 group relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/10 animate-fadeIn delay-100">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500 blur-[60px] opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Avg Rating</p>
                        <h3 className="text-3xl font-bold text-white flex items-center gap-2 group-hover:scale-105 transition-transform origin-left">
                            {stats?.averageRating || 0} <span className="text-sm text-yellow-500 animate-pulse">★</span>
                        </h3>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 group-hover:rotate-12 transition-transform">
                        <Star size={24} fill="currentColor" />
                    </div>
                </div>
            </div>

            {/* Widget 2: Sessions */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 animate-fadeIn delay-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 blur-[60px] opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Sessions</p>
                        <h3 className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{stats?.totalSessions || 0}</h3>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:rotate-12 transition-transform">
                        <Trophy size={24} />
                    </div>
                </div>
            </div>

            {/* Widget 3: Skills */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 hover:border-neon-blue/50 transition-all duration-300 group relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-neon-blue/10 animate-fadeIn delay-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blue blur-[60px] opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Skills Posted</p>
                        <h3 className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{stats?.totalSkills || 0}</h3>
                    </div>
                    <div className="p-3 bg-neon-blue/10 rounded-2xl text-neon-blue group-hover:rotate-12 transition-transform">
                        <Zap size={24} />
                    </div>
                </div>
            </div>

            {/* Widget 4: Pending Requests */}
            <div onClick={() => navigate('/requests')} className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 hover:border-red-500/50 transition-all duration-300 group relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/10 animate-fadeIn delay-400">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 blur-[60px] opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">New Requests</p>
                        <h3 className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{stats?.pendingRequests || 0}</h3>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-2xl text-red-400 relative group-hover:rotate-12 transition-transform">
                        <Activity size={24} />
                        {stats?.pendingRequests > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                    </div>
                </div>
            </div>
        </div>

        {/* --- Main Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slideUp delay-500">
            
            {/* Left Col (2/3): UP NEXT */}
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="text-neon-blue"/> Up Next
                </h2>

                {stats?.nextMeeting ? (
                    <div className="bg-gradient-to-r from-dark-800 to-dark-900 p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl group hover:border-neon-blue/30 transition-all duration-500">
                        {/* Animated Glow BG */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue blur-[120px] opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 blur-[120px] opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <span className="bg-neon-blue/20 text-neon-blue px-3 py-1 rounded-lg text-xs font-bold border border-neon-blue/20 mb-3 inline-block animate-pulse">
                                    UPCOMING SESSION
                                </span>
                                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">{stats.nextMeeting.title}</h3>
                                <p className="text-slate-400 mb-6 max-w-lg">{stats.nextMeeting.description}</p>
                                
                                <div className="flex items-center gap-6 text-sm text-slate-300">
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                                        <Calendar size={16} className="text-neon-blue"/>
                                        <span className="font-bold">{new Date(stats.nextMeeting.scheduledDate).toDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                                        <Clock size={16} className="text-purple-400"/>
                                        <span className="font-bold">{new Date(stats.nextMeeting.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({stats.nextMeeting.duration} min)</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleJoinMeeting(stats.nextMeeting.meetingLink)}
                                className="bg-neon-blue hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-neon-blue/20 transition-all transform hover:-translate-y-1 hover:shadow-neon-blue/40 flex items-center gap-2 whitespace-nowrap active:scale-95"
                            >
                                Join Now <ArrowRight size={20} className="animate-bounce-right"/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-10 text-center flex flex-col items-center justify-center hover:bg-white/10 transition-colors duration-300 group">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500 group-hover:scale-110 transition-transform group-hover:text-neon-blue">
                            <Clock size={32}/>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Upcoming Sessions</h3>
                        <p className="text-slate-400 mb-6">You are free! Explore the market to learn or teach something new.</p>
                        <button onClick={() => navigate('/explore')} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all border border-white/10 hover:border-white/30 hover:shadow-lg">
                            Find a Mentor
                        </button>
                    </div>
                )}
            </div>

            {/* Right Col (1/3): Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="space-y-4">
                    
                    {/* Action 1 */}
                    <div onClick={() => navigate('/profile')} className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/40 to-dark-900 border border-purple-500/20 cursor-pointer hover:border-purple-500/50 transition-all duration-300 group hover:-translate-x-[-5px] hover:shadow-lg hover:shadow-purple-500/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                                <Zap size={24}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">Share Knowledge</h4>
                                <p className="text-xs text-slate-400">Post a new skill to teach.</p>
                            </div>
                        </div>
                    </div>

                    {/* Action 2 */}
                    <div onClick={() => navigate('/explore')} className="p-5 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-dark-900 border border-neon-blue/20 cursor-pointer hover:border-neon-blue/50 transition-all duration-300 group hover:-translate-x-[-5px] hover:shadow-lg hover:shadow-neon-blue/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-neon-blue/20 rounded-xl text-neon-blue group-hover:scale-110 group-hover:bg-neon-blue group-hover:text-white transition-all duration-300">
                                <Search size={24}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-neon-blue transition-colors">Learn Something</h4>
                                <p className="text-xs text-slate-400">Find an expert mentor.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes text-shimmer {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        .animate-text-shimmer {
            animation: text-shimmer 3s linear infinite;
        }

        @keyframes swing {
            0%, 100% { transform: rotate(0deg); }
            20% { transform: rotate(15deg); }
            40% { transform: rotate(-10deg); }
            60% { transform: rotate(5deg); }
            80% { transform: rotate(-5deg); }
        }
        .animate-swing {
            animation: swing 2s infinite ease-in-out;
            transform-origin: top center;
        }

        @keyframes bounce-right {
             0%, 100% { transform: translateX(0); }
             50% { transform: translateX(3px); }
        }
        .animate-bounce-right {
            animation: bounce-right 1s infinite;
        }

        @keyframes fadeInOriginTop {
            from { opacity: 0; transform: scaleY(0.9) translateY(-10px); }
            to { opacity: 1; transform: scaleY(1) translateY(0); }
        }
        .animate-fadeInOriginTop {
            animation: fadeInOriginTop 0.2s ease-out forwards;
            transform-origin: top;
        }

        .animate-slideDown { animation: slideDown 0.8s ease-out forwards; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
};

export default Dashboard;