import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';  // Correct path to pages
import SignupPage from './pages/SignupPage';    // Correct path to pages
import SignInPage from './pages/SignInPage';    // Correct path to pages
import UserDashboard from './pages/UserDashboard';  // Correct path to pages
import AdminDashboard from './pages/AdminDashboard';  // Correct path to pages
import GovernmentOfficialDashboard from './pages/GovernmentOfficialDashboard';  // Correct path to Government Dashboard
import { AuthProvider } from './context/AuthContext';  // Correct path to context
import PrivateRoute from './components/PrivateRoute';  // Correct path to components

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SignInPage />} />
          
          {/* Private routes based on user roles */}
          <Route path="/user-dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/admin-dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/government-official-dashboard" element={<PrivateRoute role="government official"><GovernmentOfficialDashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
