// src/pages/UserDashboard.js
import React from 'react';
import './UserDashboard.css'; // Import CSS file for styling

const UserDashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-background">
        <div className="user-profile">
          <div className="profile-card">
            <div className="profile-pic">
              <span className="profile-initial">A</span>
            </div>
            <h2>Alisa Lautner</h2>
            <p>@alisa.lala</p>
            <button className="profile-btn">Edit profile</button>
            <button className="profile-btn">Share</button>
          </div>
        </div>

        {/* Dashboard Options Section */}
        <div className="dashboard-options">
          <div className="dashboard-card">
            <div className="card-icon">&#128663;</div> {/* Car icon */}
            <h3>My Vehicles</h3>
          </div>
          <div className="dashboard-card">
            <div className="card-icon">&#x2194;</div> {/* Transfer icon */}
            <h3>Ownership Transfer</h3>
          </div>
          <div className="dashboard-card">
            <div className="card-icon">&#128100;</div> {/* Registration icon */}
            <h3>Registration and Approvals</h3>
          </div>
          <div className="dashboard-card">
            <div className="card-icon">&#128274;</div> {/* Lock icon */}
            <h3>Change Password</h3>
          </div>
          <div className="dashboard-card">
            <div className="card-icon">&#8505;</div> {/* Info icon */}
            <h3>Help and Support</h3>
          </div>
          <div className="dashboard-card">
            <div className="card-icon">&#9881;</div> {/* Settings icon */}
            <h3>Security Settings</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
