import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Trash2, BookOpen, Star, X, Edit2, Camera, AlertTriangle, User as UserIcon, GraduationCap, Mic } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUserSkills, addSkill, deleteSkill, updateSkill, getUserById, updateUserProfile, uploadProfileImage } from '../services/api';

const ProfilePage = () => {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole') || 'LEARNER';

  // --- States ---
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals Visibility
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Tracking
  const [editingSkillId, setEditingSkillId] = useState(null); 
  const [skillToDelete, setSkillToDelete] = useState(null);

  // Forms
  const [skillForm, setSkillForm] = useState({
    title: '', description: '', category: 'Technology', proficiency: 'Beginner', type: 'LEARN', userId: userId, tags: []
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '', lastName: '', bio: '', profileImage: ''
  });

  // --- 1. Load Data ---
  const fetchData = async () => {
    try {
        if(!userId) return;
        
        const userRes = await getUserById(userId);
        setUser(userRes.data);
        
        setProfileForm({
            firstName: userRes.data.firstName || '',
            lastName: userRes.data.lastName || '',
            bio: userRes.data.bio || '',
            profileImage: userRes.data.profileImage || ''
        });

        const skillsRes = await getUserSkills(userId);
        setSkills(skillsRes.data);

    } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile data.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. Image Upload ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const loadingToast = toast.loading("Uploading image...");
    try {
        const res = await uploadProfileImage(userId, file);
        const updatedUser = res.data;
        setUser(updatedUser);
        setProfileForm(prev => ({ ...prev, profileImage: updatedUser.profileImage }));
        toast.success("Profile Photo Updated!", { id: loadingToast });
    } catch (error) {
        toast.error("Upload failed.", { id: loadingToast });
    }
  };

  // --- 3. Profile Update ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
        await updateUserProfile(userId, profileForm);
        toast.success("Profile Info Updated!");
        setShowProfileModal(false);
        fetchData(); 
        localStorage.setItem('userName', profileForm.firstName);
    } catch (error) {
        toast.error("Failed to update profile.");
    }
  };

  // --- 4. Skill Handlers ---
  const openAddModal = () => {
    setEditingSkillId(null);
    const defaultType = userRole === 'MENTOR' ? 'TEACH' : 'LEARN';
    setSkillForm({ title: '', description: '', category: 'Technology', proficiency: 'Beginner', type: defaultType, userId: userId, tags: [] });
    setShowSkillModal(true);
  };

  const openEditModal = (skill) => {
    setEditingSkillId(skill.skillId || skill.id);
    setSkillForm({
        title: skill.title, 
        description: skill.description, 
        category: skill.category, 
        proficiency: skill.proficiency || 'Beginner', 
        type: skill.type, 
        userId: userId,
        tags: skill.tags || []
    });
    setShowSkillModal(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    try {
        const finalForm = { ...skillForm };

        if (editingSkillId) {
            await updateSkill(editingSkillId, finalForm);
            toast.success("Skill Updated!");
        } else {
            await addSkill(finalForm);
            toast.success("Skill Added!");
        }
        setShowSkillModal(false);
        fetchData();
    } catch (error) {
        toast.error("Failed to save skill.");
    }
  };

  const confirmDelete = (id) => {
    setSkillToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
        await deleteSkill(skillToDelete);
        toast.success("Skill Deleted!");
        setShowDeleteModal(false);
        setSkills(skills.filter(s => (s.skillId || s.id) !== skillToDelete));
    } catch (error) {
        toast.error("Failed to delete.");
    }
  };

  if (loading) return <div className="min-h-screen bg-dark-900 flex justify-center items-center text-white"><div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-dark-900 flex text-white font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-black">
        
        {/* --- USER PROFILE CARD --- */}
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 flex items-center justify-between mb-10 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue blur-[100px] opacity-10"></div>
            
            <div className="flex items-center gap-8 z-10">
                {/* Profile Image */}
                <div className="relative group/img">
                    {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white/10 shadow-2xl object-cover" />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-5xl font-bold capitalize border-4 border-white/10 shadow-2xl text-slate-300">
                            {user?.firstName?.charAt(0) || <UserIcon size={48}/>}
                        </div>
                    )}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-black/80 px-4 py-1 rounded-full text-xs font-bold border border-white/20 shadow-lg text-neon-blue uppercase tracking-wider">
                        {userRole}
                    </div>
                </div>

                {/* User Details */}
                <div>
                    <h1 className="text-4xl font-bold capitalize text-white flex items-center gap-3">
                        {user?.firstName} {user?.lastName}
                        
                        {/* 🔥🔥🔥 RATING BADGE 🔥🔥🔥 */}
                        {user?.averageRating > 0 && (
                            <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-sm ml-2">
                                <Star size={18} className="text-yellow-400 fill-yellow-400"/>
                                <span className="font-bold text-yellow-400 text-lg">{user.averageRating}</span>
                                <span className="text-slate-500 text-xs">({user.totalReviews} reviews)</span>
                            </div>
                        )}
                    </h1>
                    
                    <p className="text-slate-400 mt-3 max-w-xl leading-relaxed text-lg">{user?.bio || "No bio added yet. Tell others about yourself!"}</p>
                    
                    <div className="flex gap-4 mt-6">
                        <span className="px-4 py-1.5 bg-white/5 text-slate-300 text-xs font-bold rounded-full border border-white/10 flex items-center gap-2">
                             📧 {user?.email}
                        </span>
                        <span className="px-4 py-1.5 bg-purple-500/10 text-purple-300 text-xs font-bold rounded-full border border-purple-500/20 flex items-center gap-2">
                            📚 {skills.length} Skills Posted
                        </span>
                    </div>
                </div>
            </div>
            
            <button onClick={() => setShowProfileModal(true)} className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl transition-all z-10 border border-white/10 shadow-lg group-hover:border-neon-blue/30">
                <Edit2 size={22} className="text-slate-300 group-hover:text-white"/>
            </button>
        </div>

        {/* --- SKILLS SECTION --- */}
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                <BookOpen className="text-neon-blue" size={28}/> My Posted Skills
            </h2>
            <button onClick={openAddModal} className="bg-neon-blue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-neon-blue/20 transition-all transform hover:-translate-y-1">
                <Plus size={20} /> Post New Skill
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
                <div key={skill.skillId || skill.id} className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 hover:border-neon-blue/40 transition-all group relative hover:shadow-2xl hover:shadow-neon-blue/5">
                    
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => openEditModal(skill)} className="text-slate-400 hover:text-white p-2 bg-black/50 rounded-lg border border-white/10 backdrop-blur-md"><Edit2 size={16}/></button>
                        <button onClick={() => confirmDelete(skill.skillId || skill.id)} className="text-slate-400 hover:text-red-500 p-2 bg-black/50 rounded-lg border border-white/10 backdrop-blur-md"><Trash2 size={16}/></button>
                    </div>

                    <div className="mb-5">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-md border border-white/5">{skill.category}</span>
                        <h3 className="text-xl font-bold text-white mt-4">{skill.title}</h3>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 min-h-[40px] leading-relaxed">{skill.description}</p>
                    
                    {/* Display Type: TEACH or LEARN */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            {skill.type === 'TEACH' ? (
                                <>
                                    <div className="bg-yellow-500/10 p-2 rounded-lg"><Mic size={16} className="text-yellow-500"/></div>
                                    <div>
                                        <span className="text-xs font-bold text-yellow-500 block uppercase tracking-wide">Mentoring</span>
                                        <span className="text-[10px] text-slate-500 font-medium">{skill.proficiency}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-green-500/10 p-2 rounded-lg"><GraduationCap size={16} className="text-green-500"/></div>
                                    <span className="text-xs font-bold text-green-500 uppercase tracking-wide">Learning</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {skills.length === 0 && (
                <div className="col-span-full text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-3xl bg-white/5">
                    <p className="text-lg">No skills posted yet.</p>
                    <p className="text-sm mt-2">Share what you know or what you want to learn!</p>
                </div>
            )}
        </div>
      </div>

      {/* --- MODAL 1: ADD / EDIT SKILL --- */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-dark-800 w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-8 relative bg-gradient-to-b from-dark-800 to-black">
                <button onClick={() => setShowSkillModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"><X/></button>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    {editingSkillId ? <Edit2 className="text-neon-blue"/> : <Plus className="text-neon-blue"/>} 
                    {editingSkillId ? 'Edit Skill' : 'Post New Skill'}
                </h3>
                
                <form onSubmit={handleSaveSkill} className="space-y-5">
                    
                    {/* 🔥 1. TYPE SELECTION */}
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-2 block tracking-wider">I want to...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${skillForm.type === 'LEARN' ? 'bg-green-500/10 border-green-500 text-green-400 shadow-lg shadow-green-900/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                                <input type="radio" name="type" value="LEARN" className="hidden" checked={skillForm.type === 'LEARN'} onChange={() => setSkillForm({...skillForm, type: 'LEARN'})} />
                                <GraduationCap size={24}/> <span className="font-bold text-sm">Learn this</span>
                            </label>
                            <label className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${skillForm.type === 'TEACH' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-lg shadow-yellow-900/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                                <input type="radio" name="type" value="TEACH" className="hidden" checked={skillForm.type === 'TEACH'} onChange={() => setSkillForm({...skillForm, type: 'TEACH'})} />
                                <Mic size={24}/> <span className="font-bold text-sm">Teach this</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1.5 block tracking-wider">Skill Title</label>
                        <input type="text" placeholder="e.g. Advanced React Patterns" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:outline-none transition-all" value={skillForm.title} onChange={(e) => setSkillForm({...skillForm, title: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold mb-1.5 block tracking-wider">Category</label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:outline-none" value={skillForm.category} onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}>
                                <option className="bg-dark-800" value="Technology">Technology</option>
                                <option className="bg-dark-800" value="Art">Art</option>
                                <option className="bg-dark-800" value="Music">Music</option>
                                <option className="bg-dark-800" value="Business">Business</option>
                                <option className="bg-dark-800" value="Language">Language</option>
                            </select>
                        </div>
                        {/* Proficiency visible only if TEACH is selected */}
                        {skillForm.type === 'TEACH' && (
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1.5 block tracking-wider">My Level</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:outline-none" value={skillForm.proficiency} onChange={(e) => setSkillForm({...skillForm, proficiency: e.target.value})}>
                                    <option className="bg-dark-800" value="Beginner">Beginner</option>
                                    <option className="bg-dark-800" value="Intermediate">Intermediate</option>
                                    <option className="bg-dark-800" value="Expert">Expert</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1.5 block tracking-wider">Description</label>
                        <textarea placeholder="Brief details about what you offer or need..." required rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:outline-none resize-none" value={skillForm.description} onChange={(e) => setSkillForm({...skillForm, description: e.target.value})}></textarea>
                    </div>
                    <button className="w-full bg-neon-blue py-3.5 rounded-xl font-bold text-white hover:bg-blue-600 transition-all shadow-lg shadow-neon-blue/20 mt-2 tracking-wide uppercase">
                        {editingSkillId ? 'Update Skill' : 'Post Skill'}
                    </button>
                </form>
            </div>
        </div>
      )}
      
      {/* Profile Modal & Delete Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-dark-800 w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-8 relative bg-gradient-to-b from-dark-800 to-black">
                <button onClick={() => setShowProfileModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white"><X/></button>
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Edit Profile</h3>
                <div className="space-y-6">
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-dark-700 border-2 border-white/20 overflow-hidden mb-4 shadow-xl">
                            {profileForm.profileImage ? <img src={profileForm.profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500"><Camera size={30}/></div>}
                        </div>
                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/20 text-white px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"><Camera size={16} /><span>Change Photo</span><input type="file" accept="image/*" className="hidden" onChange={handleImageChange} /></label>
                    </div>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs text-slate-400 uppercase font-bold mb-1.5 block">First Name</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:outline-none" value={profileForm.firstName} onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})} /></div>
                            <div><label className="text-xs text-slate-400 uppercase font-bold mb-1.5 block">Last Name</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:outline-none" value={profileForm.lastName} onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})} /></div>
                        </div>
                        <div><label className="text-xs text-slate-400 uppercase font-bold mb-1.5 block">Bio</label><textarea rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:outline-none resize-none" value={profileForm.bio} onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}></textarea></div>
                        <button className="w-full bg-purple-600 py-3.5 rounded-xl font-bold text-white hover:bg-purple-700 shadow-lg shadow-purple-900/20 mt-2 uppercase tracking-wide">Save Details</button>
                    </form>
                </div>
            </div>
        </div>
      )}
      
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-dark-800 w-full max-w-sm rounded-3xl border border-red-500/30 p-8 text-center bg-gradient-to-b from-dark-800 to-black">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 border border-red-500/20"><AlertTriangle size={32} /></div>
                <h3 className="text-2xl font-bold text-white mb-2">Delete Skill?</h3>
                <p className="text-slate-400 mb-6 text-sm">This action cannot be undone.</p>
                <div className="flex gap-3"><button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-bold">Cancel</button><button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">Delete</button></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;