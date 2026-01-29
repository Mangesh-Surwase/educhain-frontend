import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Globe, GitPullRequest, Calendar, User, LogOut, BookOpen } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  
  const [userInfo, setUserInfo] = useState({ name: 'User', email: '', image: null });

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName') || 'User';
    // 🔥 Get Profile Image
    const image = localStorage.getItem('userImage'); 

    if (name) setUserInfo({ name, email: email || 'Member', image });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Explore Market', path: '/explore', icon: <Globe size={20} /> },
    { name: 'My Requests', path: '/requests', icon: <GitPullRequest size={20} /> },
    { name: 'Meetings', path: '/meetings', icon: <Calendar size={20} /> },
    { name: 'My Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-dark-900/95 backdrop-blur-xl border-r border-white/5 flex flex-col fixed left-0 top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
      
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="p-2 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-lg shadow-lg shadow-neon-blue/20">
          <BookOpen size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 tracking-wide">EduChain</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-2">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${isActive(item.path) ? 'bg-white/5 text-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.1)] border border-neon-blue/30' : 'text-slate-400 hover:bg-white/5 hover:text-white hover:border hover:border-white/10'}`}
          >
            {/* Active Indicator Line */}
            {isActive(item.path) && <div className="absolute left-0 top-0 h-full w-1 bg-neon-blue rounded-r-full shadow-[0_0_10px_#00f3ff]"></div>}
            
            <span className={`z-10 transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
            <span className="font-medium z-10">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-3 mb-3 flex items-center gap-3 border border-white/5 hover:border-white/20 transition-all cursor-default group">
            {/* 🔥 Show Image if available, else Initials */}
            {userInfo.image ? (
                <img 
                    src={userInfo.image} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/10 group-hover:border-neon-blue transition-colors"
                />
            ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold capitalize border-2 border-white/10 group-hover:border-neon-blue transition-colors">
                    {userInfo.name.charAt(0)}
                </div>
            )}
            
            <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate capitalize group-hover:text-neon-blue transition-colors">{userInfo.name}</p>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-xs text-slate-500 truncate">Online</p>
                </div>
            </div>
        </div>
        
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all font-medium border border-transparent hover:border-red-500/20 active:scale-95">
          <LogOut size={18} /><span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;