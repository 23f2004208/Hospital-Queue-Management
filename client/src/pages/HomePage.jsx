import React from 'react';
import { Link } from 'react-router-dom';
import { FaHospital, FaUserInjured, FaTv, FaUserMd, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="container">
          <div className="logo">
            <FaHospital size={40} />
            <h1>Sunrise Multispeciality Hospital</h1>
          </div>
          <nav className="nav">
            {isAuthenticated ? (
              <>
                <span className="welcome">Welcome, {user?.name}</span>
                {(user?.role === 'staff' || user?.role === 'admin' || user?.role === 'doctor') && (
                  <Link to="/staff" className="nav-link">Dashboard</Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="nav-link">Admin Panel</Link>
                )}
              </>
            ) : (
              <Link to="/login" className="nav-link">Staff Login</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="hero">
          <div className="container">
            <h2>Intelligent Queue Management System</h2>
            <p className="hero-subtitle">
              Reducing wait times, prioritizing emergencies, and providing real-time updates
            </p>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h3>Quick Access</h3>
            <div className="feature-grid">
              <Link to="/register" className="feature-card">
                <div className="feature-icon">
                  <FaUserInjured size={48} />
                </div>
                <h4>Patient Registration</h4>
                <p>Register as a walk-in patient or check-in for your appointment</p>
              </Link>

              <Link to="/display" className="feature-card">
                <div className="feature-icon">
                  <FaTv size={48} />
                </div>
                <h4>Live Queue Display</h4>
                <p>View current queue status and token numbers being served</p>
              </Link>

              {isAuthenticated && (user?.role === 'staff' || user?.role === 'admin' || user?.role === 'doctor') && (
                <Link to="/staff" className="feature-card">
                  <div className="feature-icon">
                    <FaUserMd size={48} />
                  </div>
                  <h4>Staff Dashboard</h4>
                  <p>Manage queue, call patients, and update status</p>
                </Link>
              )}

              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin" className="feature-card">
                  <div className="feature-icon">
                    <FaCog size={48} />
                  </div>
                  <h4>Admin Panel</h4>
                  <p>Manage doctors, view analytics, and system settings</p>
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="benefits">
          <div className="container">
            <h3>System Benefits</h3>
            <div className="benefits-grid">
              <div className="benefit-item">
                <h4>⚡ Reduced Wait Times</h4>
                <p>Smart queue management reduces average waiting time by 40%</p>
              </div>
              <div className="benefit-item">
                <h4>🚨 Emergency Priority</h4>
                <p>Automatic prioritization ensures critical cases are seen immediately</p>
              </div>
              <div className="benefit-item">
                <h4>📱 Real-time Updates</h4>
                <p>Live notifications keep patients informed of their queue position</p>
              </div>
              <div className="benefit-item">
                <h4>📊 Analytics</h4>
                <p>Comprehensive data helps optimize hospital operations</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="container">
          <p>&copy; 2024 Sunrise Multispeciality Hospital. All rights reserved.</p>
          <p>Intelligent Queue Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
