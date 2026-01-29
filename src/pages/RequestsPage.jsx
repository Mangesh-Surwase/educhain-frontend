import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Check, X, Clock, Send, Inbox, User, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { getReceivedRequests, getSentRequests, updateRequestStatus, scheduleMeeting } from '../services/api';

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId'); // 🔥 Logged In User ID

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [meetingForm, setMeetingForm] = useState({
    date: '', time: '', duration: 30, meetingLink: '', title: '', description: ''
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
        const res = activeTab === 'received' ? await getReceivedRequests() : await getSentRequests();
        setRequests(res.data);
    } catch (error) {
        toast.error("Failed to load requests");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [activeTab]);

  const handleStatusUpdate = async (requestId, status) => {
    const toastId = toast.loading("Updating...");
    try {
        await updateRequestStatus(requestId, status);
        toast.success(`Request ${status}!`, { id: toastId });
        fetchRequests();
    } catch (error) {
        toast.error("Action failed", { id: toastId });
    }
  };

  const openScheduleModal = (req) => {
    setSelectedRequest(req);
    setMeetingForm({ 
        ...meetingForm, 
        title: `Session for ${req.skill.title}`,
        description: `Discussion about ${req.skill.title}` 
    });
    setShowModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Scheduling...");
    try {
        const finalDate = `${meetingForm.date}T${meetingForm.time}:00`;

        const payload = {
            requestId: selectedRequest.id,
            title: meetingForm.title,
            description: meetingForm.description,
            scheduledDate: finalDate,
            duration: meetingForm.duration,
            meetingLink: meetingForm.meetingLink
        };

        await scheduleMeeting(payload);
        toast.success("Session Scheduled Successfully!", { id: toastId });
        setShowModal(false);
    } catch (error) {
        const msg = error.response?.data?.error || "Failed to schedule meeting.";
        toast.error(msg, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex text-white font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-black">
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">My Requests 📬</h1>
            <p className="text-slate-400">Manage your incoming and outgoing connections.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-white/10 pb-1">
            <button onClick={() => setActiveTab('received')} className={`pb-3 px-2 font-bold flex items-center gap-2 transition-all text-sm tracking-wide ${activeTab === 'received' ? 'text-neon-blue border-b-2 border-neon-blue' : 'text-slate-400 hover:text-white'}`}><Inbox size={18}/> RECEIVED</button>
            <button onClick={() => setActiveTab('sent')} className={`pb-3 px-2 font-bold flex items-center gap-2 transition-all text-sm tracking-wide ${activeTab === 'sent' ? 'text-neon-blue border-b-2 border-neon-blue' : 'text-slate-400 hover:text-white'}`}><Send size={18}/> SENT</button>
        </div>

        {/* List */}
        {loading ? (
            <div className="flex justify-center mt-20"><div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
            <div className="space-y-4">
                {requests.map((req) => {
                    // 🔥🔥🔥 SMART MENTOR LOGIC (Frontend) 🔥🔥🔥
                    // 1. If Skill is 'TEACH': Poster is Mentor.
                    // 2. If Skill is 'LEARN': Requester is Mentor.
                    let mentorId;
                    if (req.skill.type === 'LEARN') {
                        mentorId = req.requester.id; // Requester teaches
                    } else {
                        mentorId = req.skill.user.id; // Poster teaches
                    }
                    
                    const isMentor = String(mentorId) === userId;

                    return (
                        <div key={req.id} className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center justify-between hover:border-white/20 transition-all shadow-lg hover:shadow-neon-blue/5">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-inner">
                                    {activeTab === 'received' 
                                        ? (req.requester?.profileImage ? <img src={req.requester.profileImage} className="w-full h-full object-cover"/> : <User className="text-slate-400"/>)
                                        : (req.skill?.user?.profileImage ? <img src={req.skill.user.profileImage} className="w-full h-full object-cover"/> : <User className="text-slate-400"/>)
                                    }
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">
                                        {activeTab === 'received' ? `${req.requester.firstName} ${req.requester.lastName}` : `${req.skill.user.firstName} ${req.skill.user.lastName}`}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {req.skill.type === 'LEARN' ? <GraduationCap size={14} className="text-pink-400"/> : <BookOpen size={14} className="text-emerald-400"/>}
                                        <p className="text-sm text-slate-400">
                                            {activeTab === 'received' ? "Connection for:" : "Requested Skill:"} 
                                            <span className="ml-2 px-2 py-0.5 rounded-md bg-neon-blue/10 text-neon-blue font-bold text-xs border border-neon-blue/20">{req.skill.title}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {req.status === 'PENDING' ? (
                                    activeTab === 'received' ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleStatusUpdate(req.id, 'ACCEPTED')} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500 hover:text-white transition-all font-bold text-sm flex items-center gap-2 border border-green-500/20"><Check size={16}/> Accept</button>
                                            <button onClick={() => handleStatusUpdate(req.id, 'REJECTED')} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-sm flex items-center gap-2 border border-red-500/20"><X size={16}/> Reject</button>
                                        </div>
                                    ) : <span className="px-4 py-1.5 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20 flex items-center gap-2"><Clock size={14}/> Awaiting Response</span>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 ${req.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            {req.status === 'ACCEPTED' ? <Check size={12}/> : <X size={12}/>} {req.status}
                                        </span>

                                        {/* 🔥 Schedule Button: Only Visible if Accepted AND User is MENTOR */}
                                        {req.status === 'ACCEPTED' && (
                                            isMentor ? (
                                                <button onClick={() => openScheduleModal(req)} className="bg-neon-blue hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-neon-blue/20 transition-all border border-neon-blue/50">
                                                    <Calendar size={16}/> Schedule
                                                </button>
                                            ) : (
                                                <span className="text-slate-500 text-xs flex items-center gap-1">
                                                    <Clock size={12}/> Waiting for Schedule
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {requests.length === 0 && (
                    <div className="text-center py-20 text-slate-500 bg-white/5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center gap-3">
                        <Inbox size={48} className="opacity-20"/>
                        <p>No {activeTab} requests found.</p>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-dark-800 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative bg-gradient-to-b from-dark-800 to-black">
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X/></button>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Calendar className="text-neon-blue"/> Schedule Session</h3>
                
                <form onSubmit={handleScheduleSubmit} className="space-y-5">
                    <div><label className="text-xs text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Session Title</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue outline-none transition-all" value={meetingForm.title} onChange={e => setMeetingForm({...meetingForm, title: e.target.value})} required /></div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Date</label><input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue outline-none transition-all" value={meetingForm.date} onChange={e => setMeetingForm({...meetingForm, date: e.target.value})} required /></div>
                        <div><label className="text-xs text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Time</label><input type="time" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue outline-none transition-all" value={meetingForm.time} onChange={e => setMeetingForm({...meetingForm, time: e.target.value})} required /></div>
                    </div>

                    <div><label className="text-xs text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Duration (mins)</label><input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue outline-none transition-all" value={meetingForm.duration} onChange={e => setMeetingForm({...meetingForm, duration: e.target.value})} /></div>
                    
                    <div><label className="text-xs text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Meeting Link (Zoom/Meet)</label><input type="url" placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue outline-none transition-all" value={meetingForm.meetingLink} onChange={e => setMeetingForm({...meetingForm, meetingLink: e.target.value})} required /></div>

                    <button className="w-full bg-neon-blue py-3.5 rounded-xl font-bold text-white hover:bg-blue-600 shadow-lg shadow-neon-blue/20 mt-4 transition-all uppercase tracking-wide">Confirm & Send</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;