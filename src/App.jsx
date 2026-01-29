import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Page Imports
import LandingPage from './pages/LandingPage'; // 🔥 Import New Page
import AuthPage from './pages/AuthPage';
import OtpPage from './pages/OtpPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage'; 
import RequestsPage from './pages/RequestsPage'; 
import MeetingsPage from './pages/MeetingsPage'; 
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
        <Toaster position="top-center" reverseOrder={false} />
        
        <Routes>
          {/* 🔥 Default Route Logic Changed 🔥 */}
          {/* जर यूजर लॉगिन असेल तर Dashboard, नाहीतर Landing Page */}
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
          
          <Route path="/login" element={<AuthPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
        </Routes>
    </Router>
  );
}

export default App;