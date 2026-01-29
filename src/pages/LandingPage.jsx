import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Zap, Shield, ArrowRight, Star, Video, CheckCircle, UserPlus, Search, Handshake, TrendingUp, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans selection:bg-neon-blue selection:text-white overflow-x-hidden">
      
      {/* --- Background Effects --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-blue rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-purple rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-pink-500 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-dark-900/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-lg">
                    <BookOpen size={24} className="text-white"/>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">EduChain</span>
            </div>
            <div className="flex gap-4">
                <button onClick={() => navigate('/login')} className="px-6 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">Log In</button>
                <button onClick={() => navigate('/login')} className="px-6 py-2 text-sm font-bold bg-white text-dark-900 rounded-full hover:bg-neon-blue hover:text-white transition-all shadow-lg shadow-white/10">Get Started</button>
            </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative pt-32 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neon-blue text-xs font-bold mb-6 animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
            </span>
            Now Live: Real-time Mentorship
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-slideUp">
            Master Skills via <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-purple-400 to-pink-500">Peer-to-Peer Exchange</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slideUp delay-100">
            Connect with students and mentors directly. Teach what you know, learn what you need. 
            No hidden fees, just pure knowledge sharing.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-slideUp delay-200">
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-neon-blue hover:bg-blue-600 text-white rounded-full font-bold text-lg shadow-lg shadow-neon-blue/30 transition-all transform hover:-translate-y-1 flex items-center gap-2">
                Start Learning Now <ArrowRight size={20}/>
            </button>
            <button onClick={() => navigate('/explore')} className="px-8 py-4 bg-dark-800 hover:bg-dark-700 text-white border border-dark-600 rounded-full font-bold text-lg transition-all flex items-center gap-2">
                Explore Mentors
            </button>
        </div>

        {/* Hero Image / Graphic */}
        <div className="mt-16 relative mx-auto max-w-4xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-dark-800/50 backdrop-blur-sm group animate-fadeIn delay-300">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900 z-10"></div>
             <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" alt="Dashboard Preview" className="w-full h-auto opacity-80 group-hover:scale-105 transition-transform duration-700" />
             
             {/* Floating Cards */}
             <div className="absolute bottom-10 left-10 z-20 bg-dark-800/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl flex items-center gap-4 animate-bounce-slow">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><CheckCircle size={20}/></div>
                <div>
                    <p className="text-xs text-slate-400">Session Completed</p>
                    <p className="font-bold text-white">Java Masterclass</p>
                </div>
             </div>

             <div className="absolute top-10 right-10 z-20 bg-dark-800/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl flex items-center gap-4 animate-bounce-slow delay-1000">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400"><Star size={20} fill="currentColor"/></div>
                <div>
                    <p className="text-xs text-slate-400">New Rating</p>
                    <p className="font-bold text-white">4.9/5.0 Stars</p>
                </div>
             </div>
        </div>
      </header>

      {/* --- Features Section --- */}
      <section className="py-24 bg-dark-900 relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose <span className="text-neon-blue">EduChain?</span></h2>
                <p className="text-slate-400 max-w-2xl mx-auto">We are building a community where knowledge flows freely. No barriers, just learning.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<Users size={32} className="text-neon-blue"/>}
                    title="Peer-to-Peer Learning"
                    desc="Connect directly with peers. Request to learn a skill or offer to teach one. Build your network while you learn."
                />
                <FeatureCard 
                    icon={<Video size={32} className="text-neon-purple"/>}
                    title="1-on-1 Live Sessions"
                    desc="Schedule live video/audio meetings effortlessly. Our dashboard keeps track of your upcoming sessions."
                />
                <FeatureCard 
                    icon={<Shield size={32} className="text-pink-500"/>}
                    title="Reputation System"
                    desc="Trust matters. Rate your mentors and build your own profile rating by teaching others effectively."
                />
            </div>
        </div>
      </section>

      {/* --- 🔥 UPDATED: How It Works Section --- */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-dark-900 to-black relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <span className="text-neon-purple font-bold tracking-wider text-sm uppercase">Simple Process</span>
                <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-6 text-white">How It Works</h2>
                <p className="text-slate-400 max-w-xl mx-auto">Get started in minutes. No complex setup required.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch relative">
                
                {/* Step 1 */}
                <StepCard 
                    number="1" 
                    icon={<UserPlus size={28} className="text-white"/>} 
                    title="Create Profile" 
                    desc="Sign up and list the skills you know and the skills you want to learn."
                    color="from-blue-500 to-cyan-500"
                />

                {/* Arrow Connector (Desktop Only) */}
                <div className="hidden md:flex items-center justify-center text-slate-600">
                    <ChevronRight size={32} className="opacity-30" />
                </div>

                {/* Step 2 */}
                <StepCard 
                    number="2" 
                    icon={<Search size={28} className="text-white"/>} 
                    title="Explore Market" 
                    desc="Search for mentors or learners in our open marketplace."
                    color="from-purple-500 to-pink-500"
                />

                <div className="hidden md:flex items-center justify-center text-slate-600">
                    <ChevronRight size={32} className="opacity-30" />
                </div>

                {/* Step 3 */}
                <StepCard 
                    number="3" 
                    icon={<Handshake size={28} className="text-white"/>} 
                    title="Connect & Meet" 
                    desc="Send requests, schedule a time, and join the 1-on-1 video session."
                    color="from-amber-500 to-orange-500"
                />

                <div className="hidden md:flex items-center justify-center text-slate-600">
                    <ChevronRight size={32} className="opacity-30" />
                </div>

                {/* Step 4 */}
                <StepCard 
                    number="4" 
                    icon={<TrendingUp size={28} className="text-white"/>} 
                    title="Grow & Rate" 
                    desc="Complete the session, rate your partner, and enhance your portfolio."
                    color="from-green-500 to-emerald-500"
                />

            </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-neon-blue to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            {/* Hover Shine Effect */}
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] group-hover:animate-shine"></div>

            <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-6">Ready to Upgrade Your Skills?</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Join thousands of students and professionals exchanging knowledge today.</p>
                <button onClick={() => navigate('/login')} className="px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-xl hover:bg-slate-100 transition-all shadow-xl transform hover:scale-105 active:scale-95">
                    Get Started for Free
                </button>
            </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-8 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>&copy; 2026 EduChain. Built for the Community.</p>
      </footer>

      {/* CSS for animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(-5%); }
            50% { transform: translateY(5%); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
        
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; opacity: 0; }
        .animate-slideUp { animation: slideUp 1s ease-out forwards; opacity: 0; transform: translateY(20px); }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-1000 { animation-delay: 1s; }

        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }

        @keyframes shine {
            100% { left: 200%; }
        }
        .group-hover\\:animate-shine {
            animation: shine 1s;
        }
      `}</style>
    </div>
  );
};

// --- Sub-components ---

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 hover:border-neon-blue/30 transition-all hover:bg-white/10 group hover:-translate-y-2 duration-300">
        <div className="mb-6 bg-dark-800 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shadow-lg shadow-black/50">{icon}</div>
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-neon-blue transition-colors">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

// 🔥 NEW: Attractive Step Card Component
const StepCard = ({ number, icon, title, desc, color }) => (
    <div className="flex-1 relative group">
        <div className="h-full p-8 bg-dark-800/40 backdrop-blur-md border border-white/5 rounded-3xl hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-neon-blue/10 flex flex-col items-center text-center hover:-translate-y-2">
            {/* Number Badge */}
            <div className="absolute top-4 right-4 text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                0{number}
            </div>

            {/* Icon Circle */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>

            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300">{desc}</p>
        </div>
    </div>
);

export default LandingPage;