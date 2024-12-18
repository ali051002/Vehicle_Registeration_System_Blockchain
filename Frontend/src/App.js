import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import SignInPage from './pages/SignInPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // Forgot Password Page
import VerifyOtpPage from './pages/verifyotp'; // Verify OTP Page
import ResetPassword from './pages/ResetPassword'; // Reset Password Page
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
import ContactForm from './components/ChatForm';
import RedesignedUnauthorizedPage from './pages/UnAuthorised';
import LoadingPage from './pages/Loading';
import LearnMorePage from './pages/LearnMore';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verifyotp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPassword />} /> {/* Reset Password Route */}
          <Route path="/chat" element={<ContactForm />} />
          <Route path="/unauthorized" element={<RedesignedUnauthorizedPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/learn" element={<LearnMorePage />} />

          {/* User Dashboard Routes */}
          <Route
            path="/user-dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-vehicle-register"
            element={
              <PrivateRoute>
                <UserVehicleRegister />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-ownership-transfer"
            element={
              <PrivateRoute>
                <UserOwnershipTransfer />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-my-vehicles"
            element={
              <PrivateRoute>
                <UserMyVehicles />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-transfer-to/:vehicleId"
            element={
              <PrivateRoute>
                <UserTransferTo />
              </PrivateRoute>
            }
          />

          {/* Admin Dashboard Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Government Official Routes */}
          <Route
            path="/government-official-dashboard"
            element={
              <PrivateRoute role="government official">
                <GovernmentOfficialDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/pending-registrations"
            element={
              <PrivateRoute role="government official">
                <PendingRegistrationsDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/ownership-transfers"
            element={
              <PrivateRoute role="government official">
                <OwnershipTransfer />
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicle-registry"
            element={
              <PrivateRoute role="government official">
                <VehicleRegistry />
              </PrivateRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <PrivateRoute role="government official">
                <AuditLogs />
              </PrivateRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<RedesignedUnauthorizedPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
