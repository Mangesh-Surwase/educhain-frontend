import axios from 'axios';

// 🔥🔥🔥 CHANGED: Connected to Live Render Backend 🔥🔥🔥
const API_URL = 'https://educhain-backend-7cv0.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- AUTH SERVICES ---
export const registerUser = async (userData) => { return await axios.post(`${API_URL}/auth/register`, userData); };
export const loginUser = async (loginData) => { return await axios.post(`${API_URL}/auth/login`, loginData); };
export const verifyOtp = async (email, otp) => { return await axios.post(`${API_URL}/auth/verify-otp?email=${email}&otp=${otp}`); };

// --- FORGOT PASSWORD APIS ---
export const forgotPassword = async (email) => { return await axios.post(`${API_URL}/auth/forgot-password?email=${email}`); };
export const resetPassword = async (data) => { return await axios.post(`${API_URL}/auth/reset-password`, data); };

// --- SKILL SERVICES ---
export const getAllSkills = async () => { return await api.get('/skills'); };
export const getUserSkills = async (userId) => { return await api.get(`/skills/user/${userId}`); };
export const addSkill = async (skillData) => { return await api.post('/skills', skillData); };
export const updateSkill = async (skillId, skillData) => { return await api.put(`/skills/${skillId}`, skillData); };
export const deleteSkill = async (skillId) => { return await api.delete(`/skills/${skillId}`); };
export const exploreSkills = async (query) => {
    const url = query ? `/skills/explore?query=${query}` : '/skills/explore';
    return await api.get(url);
};

// --- USER PROFILE SERVICES ---
export const getUserById = async (userId) => { return await api.get(`/users/${userId}`); };
export const updateUserProfile = async (userId, userData) => { return await api.put(`/users/${userId}`, userData); };
export const uploadProfileImage = async (userId, file) => {
    const formData = new FormData();
    formData.append("file", file); 
    return await api.post(`/users/${userId}/image`, formData, { headers: { "Content-Type": "multipart/form-data" } });
};

// --- REQUEST SERVICES ---
export const sendConnectionRequest = async (skillId) => { return await api.post(`/skill-requests/${skillId}`); };
export const getReceivedRequests = async () => { return await api.get('/skill-requests/received'); };
export const getSentRequests = async () => { return await api.get('/skill-requests/sent'); };
export const updateRequestStatus = async (requestId, status) => { return await api.put(`/skill-requests/${requestId}`, { status: status }); };

// --- MEETING APIS ---
export const scheduleMeeting = async (meetingData) => { return await api.post('/meetings', meetingData); };
export const getUserMeetings = async (userId) => { return await api.get(`/meetings/user/${userId}`); };
export const completeMeeting = async (meetingId, data) => { return await api.put(`/meetings/${meetingId}/complete`, data); };

// --- DASHBOARD API ---
export const getDashboardStats = async () => { return await api.get('/dashboard'); };

// --- NOTIFICATION APIS ---
export const getNotifications = async () => { return await api.get('/notifications'); };
export const markNotificationRead = async (id) => { return await api.put(`/notifications/${id}/read`); };
export const getUnreadCount = async () => { return await api.get('/notifications/unread-count'); };

export default api;