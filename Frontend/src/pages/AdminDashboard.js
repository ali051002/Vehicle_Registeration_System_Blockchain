// src/pages/AdminDashboard.js
import React from 'react';
import './AdminDashboard.css'; // Import CSS file for styling

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-background">
        <div className="admin-dashboard-header">
          <h2><span role="img" aria-label="admin">👤</span> ADMIN DASHBOARD</h2>
        </div>

        {/* Admin Statistics Section */}
        <div className="admin-stats-section">
          <div className="stat-card stat-card-red">Total number of registered vehicles</div>
          <div className="stat-card stat-card-blue">Number of approved/rejected registrations Trips</div>
          <div className="stat-card stat-card-green">Clients Number of pending vehicle registrations</div>
          <div className="stat-card stat-card-green">Number of pending ownership transfers Daily</div>
          <div className="stat-card stat-card-dark-green">Number of successful ownership transfers</div>
          <div className="stat-card stat-card-dark-green">Number of active users</div>
          <div className="stat-card stat-card-blue">Number of approved/rejected registrations Trips</div>
          <div className="stat-card stat-card-red">Total number of registered vehicles</div>
        </div>

        {/* Admin Management Section */}
        <div className="admin-management-section">
          <div className="management-card management-card-teal">Vehicle Registration Management</div>
          <div className="management-card management-card-orange">User Management</div>
          <div className="management-card management-card-red">Ownership Transfer Management</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
