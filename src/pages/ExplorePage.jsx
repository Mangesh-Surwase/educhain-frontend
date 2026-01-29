import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, User, Mic, GraduationCap, ArrowRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { exploreSkills, sendConnectionRequest } from '../services/api'; 

const ExplorePage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load default matches when page opens
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    try {
        const res = await exploreSkills(query);
        setResults(res.data);
    } catch (error) {
        console.error(error);
        toast.error("Search failed");
    } finally {
        setLoading(false);
    }
  };

  const handleConnect = async (skillId) => {
    const toastId = toast.loading("Sending Request...");
    try {
        await sendConnectionRequest(skillId);
        toast.success("Request Sent Successfully!", { id: toastId });
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.response?.data || "Failed to send request";
        toast.error(errorMsg, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex text-white font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-black">
        
        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Explore Market 🚀</h1>
            <p className="text-slate-400 text-lg">Find the right people based on your needs.</p>
        </div>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="flex gap-4 mb-12 max-w-3xl relative z-10 mx-auto md:mx-0">
            <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-neon-blue blur-xl opacity-10 group-hover:opacity-20 transition-opacity rounded-2xl"></div>
                <Search className="absolute left-5 top-4 text-slate-400 group-hover:text-neon-blue transition-colors" size={20}/>
                <input 
                    type="text" 
                    placeholder="Search for a skill (e.g. Java, Piano, Design)..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-neon-blue focus:outline-none transition-all placeholder-slate-500 relative z-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <button className="bg-neon-blue hover:bg-blue-600 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-neon-blue/20 hover:shadow-neon-blue/40 transform hover:-translate-y-1">
                Search
            </button>
        </form>

        {/* RESULTS GRID */}
        {loading ? (
            <div className="flex flex-col items-center justify-center mt-20 text-slate-500 gap-4">
                 <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                 <p className="animate-pulse">Scanning the network...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {results.map((skill) => (
                    <div key={skill.skillId || skill.id} className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 hover:border-neon-blue/40 transition-all group relative flex flex-col h-full hover:shadow-2xl hover:shadow-neon-blue/5">
                        
                        {/* Header: Skill Name & Badge */}
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${skill.type === 'TEACH' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                    {skill.type === 'TEACH' ? 'Mentor' : 'Learner'}
                                </span>
                                <h3 className="text-xl font-bold text-white mt-3 group-hover:text-neon-blue transition-colors">{skill.title}</h3>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl text-slate-400 border border-white/5">
                                {skill.type === 'TEACH' ? <Mic size={20}/> : <GraduationCap size={20}/>}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">{skill.description}</p>

                        {/* Footer: User Info & Action */}
                        <div className="pt-5 border-t border-white/10 flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-3">
                                {skill.user && skill.user.profileImage ? (
                                    <img src={skill.user.profileImage} className="w-10 h-10 rounded-full object-cover border border-white/20" alt="User" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-white/10">
                                        <User size={16} className="text-slate-300"/>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-bold text-slate-200 capitalize flex items-center gap-2">
                                        {skill.user ? skill.user.firstName : 'Unknown'}
                                        
                                        {/* 🔥🔥🔥 RATING DISPLAY 🔥🔥🔥 */}
                                        {skill.user?.averageRating > 0 && (
                                            <span className="flex items-center gap-0.5 text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20">
                                                <Star size={10} fill="currentColor"/> {skill.user.averageRating}
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">{skill.proficiency || 'Beginner'}</p>
                                </div>
                            </div>

                            {/* Connect Button */}
                            <button 
                                onClick={() => handleConnect(skill.skillId || skill.id)}
                                className="px-5 py-2.5 bg-neon-blue text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-neon-blue/20 flex items-center gap-2 transform hover:scale-105"
                            >
                                Connect <ArrowRight size={14}/>
                            </button>
                        </div>
                    </div>
                ))}

                {results.length === 0 && (
                    <div className="col-span-full text-center py-20 text-slate-500 bg-white/5 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center">
                        <Search size={48} className="opacity-20 mb-4"/>
                        <p className="text-lg">No matches found.</p>
                        <p className="text-sm">Try searching for generic terms like "Music", "Code", or "Art".</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;