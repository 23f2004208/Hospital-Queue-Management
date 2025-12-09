import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserMd, FaUsers, FaChartLine, FaCog } from 'react-icons/fa';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    department: '',
    specialization: '',
    email: '',
    phone: '',
    avgConsultationTime: 15
  });

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors');
      setDoctors(data.data);
    } catch (error) {
      toast.error('Error fetching doctors');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data.data);
    } catch (error) {
      toast.error('Error fetching users');
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctors', doctorForm);
      toast.success('Doctor added successfully');
      setShowAddDoctor(false);
      setDoctorForm({
        name: '',
        department: '',
        specialization: '',
        email: '',
        phone: '',
        avgConsultationTime: 15
      });
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding doctor');
    }
  };

  const handleToggleAvailability = async (doctorId) => {
    try {
      await api.put(`/doctors/${doctorId}/availability`);
      toast.success('Availability updated');
      fetchDoctors();
    } catch (error) {
      toast.error('Error updating availability');
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p>System Management & Analytics</p>
        </div>
        <div className="header-actions">
          <Link to="/" className="btn btn-secondary">Home</Link>
          <Link to="/staff" className="btn btn-secondary">Staff Dashboard</Link>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <FaUserMd /> Doctors
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Users
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FaChartLine /> Analytics
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'doctors' && (
            <div className="doctors-section">
              <div className="section-header">
                <h2>Manage Doctors</h2>
                <button
                  onClick={() => setShowAddDoctor(!showAddDoctor)}
                  className="btn btn-primary"
                >
                  {showAddDoctor ? 'Cancel' : 'Add Doctor'}
                </button>
              </div>

              {showAddDoctor && (
                <div className="add-doctor-form">
                  <h3>Add New Doctor</h3>
                  <form onSubmit={handleAddDoctor}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={doctorForm.name}
                          onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          className="form-input"
                          value={doctorForm.email}
                          onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Department *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={doctorForm.department}
                          onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Specialization *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={doctorForm.specialization}
                          onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Phone *</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={doctorForm.phone}
                          onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Avg Consultation Time (min)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={doctorForm.avgConsultationTime}
                          onChange={(e) => setDoctorForm({ ...doctorForm, avgConsultationTime: parseInt(e.target.value) })}
                          min="5"
                          max="60"
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-success">Add Doctor</button>
                  </form>
                </div>
              )}

              <div className="doctors-list">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="doctor-card">
                    <div className="doctor-info">
                      <h3>{doctor.name}</h3>
                      <p>{doctor.specialization} | {doctor.department}</p>
                      <p>📧 {doctor.email} | 📱 {doctor.phone}</p>
                      <p>⏱️ Avg Time: {doctor.avgConsultationTime} min</p>
                    </div>
                    <div className="doctor-actions">
                      <button
                        onClick={() => handleToggleAvailability(doctor._id)}
                        className={`btn ${doctor.available ? 'btn-warning' : 'btn-success'}`}
                      >
                        {doctor.available ? 'Mark Unavailable' : 'Mark Available'}
                      </button>
                      <div className={`availability-status ${doctor.available ? 'available' : 'unavailable'}`}>
                        {doctor.available ? '🟢 Available' : '🔴 Unavailable'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <h2>System Users</h2>
              <div className="users-list">
                {users.map((user) => (
                  <div key={user._id} className="user-card">
                    <div>
                      <h3>{user.name}</h3>
                      <p>📧 {user.email}</p>
                      <p>Role: <strong>{user.role}</strong></p>
                      {user.department && <p>Department: {user.department}</p>}
                    </div>
                    <div className={`status-badge ${user.active ? 'status-active' : 'status-inactive'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <h2>Analytics & Reports</h2>
              <p>Analytics dashboard coming soon...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>System Settings</h2>
              <p>System configuration options coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
