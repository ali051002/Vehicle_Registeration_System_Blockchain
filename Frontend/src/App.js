import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import SignInPage from './pages/SignInPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GovernmentOfficialDashboard from './pages/GovernmentOfficialDashboard'; // Your dashboard
import PendingRegistrationsDetails from './pages/PendingRegistrations'; // Add the PendingRegistrationsDetails page
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

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

          {/* New route for Pending Registrations Details */}
          <Route path="/pending-registrations" element={<PendingRegistrationsDetails />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
