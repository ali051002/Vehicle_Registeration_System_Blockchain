// src/pages/LandingPage.js
import React from 'react';
import './LandingPage.css'; // Import CSS file for styling

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-logo">Secure Shift</div>
        <nav>
          <ul>
            {/* Provide valid href or replace with button for actions */}
            <li><a href="/">Platform</a></li>
            <li><a href="/about">About us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
        <div className="navbar-buttons">
          <button className="signin-btn" onClick={() => window.location.href = '/signin'}>Sign In</button>
          <button className="signup-btn" onClick={() => window.location.href = '/signup'}>Sign Up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Secure Shift!</h1>
          <p>Secure, Transparent, and Efficient Vehicle Registration System for Pakistan</p>
        </div>
        <div className="hero-image">
          {/* Replace with your own image path or URL */}
          <img src="path/to/your/hero-image.png" alt="Secure Shift Vehicle" />
        </div>
      </section>

      {/* Introduction Section */}
      <section className="introduction-section">
        <h2>Introduction</h2>
        <p>
          Our system integrates blockchain technology to ensure data integrity, reduce fraud, and improve the overall efficiency of the vehicle registration process.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <img src="path/to/your/image1.png" alt="Enhanced Trust" />
          <h3>Enhanced Trust</h3>
          <p>With transparent and secure data management, gain the trust of all stakeholders.</p>
        </div>
        <div className="feature-card">
          <img src="path/to/your/image2.png" alt="Reduced Fraud" />
          <h3>Reduced Fraud</h3>
          <p>Blockchain technology significantly reduces the risk of fraud and data manipulation.</p>
        </div>
        <div className="feature-card">
          <img src="path/to/your/image3.png" alt="Improved Efficiency" />
          <h3>Improved Efficiency</h3>
          <p>Automated processes and decentralized validation lead to faster and more reliable registration services.</p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Let's work together!</h2>
        <p>
          Join us in transforming vehicle registration. Sign up today and experience the benefits of a secure and efficient system.
        </p>
        <button className="cta-btn" onClick={() => window.location.href = '/signup'}>Join Us</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <div className="footer-logo">Logo</div>
          <p>© 2024 Secure Shift. All rights reserved.</p>
        </div>
        <div className="footer-center">
          <ul>
            {/* Replace with buttons or add valid href */}
            <li><button onClick={() => alert('Product section is coming soon!')} className="footer-link">Product</button></li>
            <li><button onClick={() => alert('Resources section is coming soon!')} className="footer-link">Resources</button></li>
            <li><button onClick={() => alert('Company section is coming soon!')} className="footer-link">Company</button></li>
          </ul>
        </div>
        <div className="footer-right">
          <p>Subscribe to our newsletter</p>
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
          <div className="social-icons">
            {/* Add social media icons here */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
