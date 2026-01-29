import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Video, Calendar, Clock, User, ExternalLink, CheckCircle, Star, X, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUserMeetings, completeMeeting } from '../services/api';

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId'); // 🔥 Logged In User ID

  // Feedback Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const fetchMeetings = async () => {
    try {
      const res = await getUserMeetings(userId);
      setMeetings(res.data);
    } catch (error) {
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeetings(); }, [userId]);

  const openMeeting = (link) => { window.open(link, '_blank'); };

  const handleCompleteClick = (meeting) => {
    setSelectedMeeting(meeting);
    setRating(0);
    setFeedback('');
    setShowModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) { toast.error("Please give a star rating! ⭐"); return; }
    const toastId = toast.loading("Submitting feedback...");
    try {
        await completeMeeting(selectedMeeting.id, { rating, feedback });
        toast.success("Marked as Completed!", { id: toastId });
        setShowModal(false);
        fetchMeetings();
    } catch (error) {
        toast.error("Failed to submit feedback", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex text-white font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-black">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">My Sessions 🎥</h1>
        <p className="text-slate-400 mb-8">Upcoming classes and mentoring sessions.</p>

        {loading ? (
            <div className="flex justify-center mt-20"><div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meetings.map((meeting) => {
                    // 🔥 Logic: Check Who is viewing
                    const isLearner = String(meeting.learner.id) === userId;
                    const isCompleted = meeting.status === 'COMPLETED';

                    return (
                        <div key={meeting.id} className={`p-6 rounded-2xl border transition-all shadow-lg relative overflow-hidden group ${isCompleted ? 'bg-dark-800/80 border-green-500/30' : 'bg-white/5 backdrop-blur-md border-white/10 hover:border-neon-blue/30'}`}>
                            
                            {/* Decorative Blob */}
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 transition-all ${isCompleted ? 'bg-green-500/10' : 'bg-neon-blue/5 group-hover:bg-neon-blue/10'}`}></div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{meeting.title}</h3>
                                    <p className="text-sm text-slate-400 mt-1 line-clamp-1">{meeting.description}</p>
                                </div>
                                <div className={`p-2 rounded-xl border ${isCompleted ? 'text-green-400 border-green-500/20 bg-green-500/10' : 'text-neon-blue border-white/10 bg-white/5'}`}>
                                    {isCompleted ? <CheckCircle size={24}/> : <Video size={24}/>}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 relative z-10">
                                <div className="flex items-center gap-3 text-slate-300 text-sm">
                                    <Calendar size={16} className="text-slate-500"/> 
                                    <span className="font-medium">{new Date(meeting.scheduledDate).toDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300 text-sm">
                                    <Clock size={16} className="text-slate-500"/> 
                                    <span className="font-medium">{new Date(meeting.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({meeting.duration} mins)</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300 text-sm">
                                    <User size={16} className="text-slate-500"/> 
                                    <span className="font-medium">
                                        {String(meeting.mentor.id) === userId 
                                            ? `Student: ${meeting.learner.firstName} ${meeting.learner.lastName}` 
                                            : `Mentor: ${meeting.mentor.firstName} ${meeting.mentor.lastName}`}
                                    </span>
                                </div>

                                {/* 🔥 Completed State Details (Visible to BOTH) */}
                                {isCompleted && meeting.rating && (
                                    <div className="mt-4 p-3 rounded-xl bg-black/20 border border-white/5">
                                        <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold mb-1">
                                            <Star size={14} fill="currentColor"/> {meeting.rating} / 5
                                        </div>
                                        {meeting.feedback && (
                                            <p className="text-slate-400 text-xs italic">"{meeting.feedback}"</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Buttons Logic */}
                            {meeting.status !== 'COMPLETED' ? (
                                <div className="flex gap-3 relative z-10">
                                    <button 
                                        onClick={() => openMeeting(meeting.meetingLink)}
                                        className="flex-1 py-3 bg-neon-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-neon-blue/20"
                                    >
                                        Join <ExternalLink size={18}/>
                                    </button>
                                    
                                    {/* 🔥 Mark Completed Button - ONLY for Learner */}
                                    {isLearner && (
                                        <button 
                                            onClick={() => handleCompleteClick(meeting)}
                                            className="px-4 py-3 bg-white/5 text-slate-300 font-bold rounded-xl hover:bg-green-600 hover:text-white transition-all border border-white/10 flex items-center justify-center"
                                            title="Mark as Completed"
                                        >
                                            <CheckCircle size={20}/>
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full py-3 bg-green-500/10 text-green-500 font-bold rounded-xl border border-green-500/20 text-center flex items-center justify-center gap-2 relative z-10 text-sm">
                                    <CheckCircle size={16}/> Session Completed
                                </div>
                            )}
                        </div>
                    );
                })}

                {meetings.length === 0 && (
                    <div className="col-span-full text-center py-20 text-slate-500 bg-white/5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center gap-3">
                        <Video size={48} className="opacity-20"/>
                        <p>No meetings scheduled yet.</p>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* FEEDBACK MODAL */}
      {showModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-dark-800 w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 relative text-center bg-gradient-to-b from-dark-800 to-black">
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X/></button>
                
                <h3 className="text-xl font-bold text-white mb-2">Rate Session ⭐</h3>
                <p className="text-slate-400 text-sm mb-6">
                    How was your session with <span className="text-neon-blue font-bold">{String(selectedMeeting.mentor.id) === userId ? selectedMeeting.learner.firstName : selectedMeeting.mentor.firstName}</span>?
                </p>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} className={`transition-all transform hover:scale-110 p-1 ${rating >= star ? 'text-yellow-400' : 'text-slate-700'}`}>
                            <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                        </button>
                    ))}
                </div>

                <textarea 
                    placeholder="Write a short review (optional)..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white mb-4 focus:border-neon-blue outline-none resize-none h-24 text-sm"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                ></textarea>

                <button onClick={handleSubmitFeedback} className="w-full bg-neon-blue py-3 rounded-xl font-bold text-white hover:bg-blue-600 shadow-lg shadow-neon-blue/20">Submit Feedback</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;