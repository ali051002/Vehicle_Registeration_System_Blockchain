import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import SignInPage from './pages/SignInPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GovernmentOfficialDashboard from './pages/GovernmentOfficialDashboard';
import PendingRegistrationsDetails from './pages/PendingRegistrations';
import OwnershipTransfer from './pages/OwnershipTransfer';
import VehicleRegistry from './pages/VehicleRegistry';
import AuditLogs from './pages/AuditLogs';  
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import UserVehicleRegister from './pages/UserVehicleRegister';
import UserOwnershipTransfer from './pages/UserOwnershipTransfer';
import UserMyVehicles from './pages/UserMyVehicles';
import UserTransferTo from './pages/UserTransferTo';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SignInPage />} />
          
          {/* User Dashboard Routes */}
          <Route path="/user-dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/user-vehicle-register" element={<PrivateRoute><UserVehicleRegister /></PrivateRoute>} />
          <Route path="/user-ownership-transfer" element={<PrivateRoute><UserOwnershipTransfer /></PrivateRoute>} />
          <Route path="/user-my-vehicles" element={<PrivateRoute><UserMyVehicles /></PrivateRoute>} />
          <Route path="/user-transfer-to/:vehicleId" element={<PrivateRoute><UserTransferTo /></PrivateRoute>} />
          
          {/* Admin and Government Routes */}
          <Route path="/admin-dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/government-official-dashboard" element={<PrivateRoute role="government official"><GovernmentOfficialDashboard /></PrivateRoute>} />
          <Route path="/pending-registrations" element={<PendingRegistrationsDetails />} />
          <Route path="/ownership-transfers" element={<PrivateRoute role="government official"><OwnershipTransfer /></PrivateRoute>} />
          <Route path="/vehicle-registry" element={<PrivateRoute role="government official"><VehicleRegistry /></PrivateRoute>} />
          <Route path="/audit-logs" element={<PrivateRoute role="government official"><AuditLogs /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;