import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSignOutAlt, FaUserMd, FaClock, FaCheckCircle } from 'react-icons/fa';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { connectSocket } from '../utils/socket';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [patients, setPatients] = useState([]);
  const [currentToken, setCurrentToken] = useState(null);
  const [stats, setStats] = useState({ waiting: 0, completed: 0, emergency: 0 });
  const [loading, setLoading] = useState(false);

  const departments = [
    'Cardiology', 'Orthopedics', 'Pediatrics', 'General Medicine',
    'Neurology', 'Dermatology', 'ENT', 'Ophthalmology'
  ];

  useEffect(() => {
    if (selectedDepartment) {
      fetchQueueData();
      
      const socket = connectSocket();
      socket.emit('join:department', selectedDepartment);

      socket.on('queue:updated', () => {
        fetchQueueData();
      });

      return () => {
        socket.emit('leave:department', selectedDepartment);
      };
    }
  }, [selectedDepartment]);

  const fetchQueueData = async () => {
    try {
      const [queueRes, patientsRes] = await Promise.all([
        api.get(`/queue/${selectedDepartment}`),
        api.get(`/patients?department=${selectedDepartment}&status=waiting`)
      ]);

      setCurrentToken(queueRes.data.data.currentToken);
      setPatients(patientsRes.data.data);

      const emergency = patientsRes.data.data.filter(p => p.priority === 'emergency').length;
      setStats({
        waiting: patientsRes.data.data.length,
        completed: queueRes.data.data.totalServed || 0,
        emergency
      });
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const handleCallNext = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/queue/next', { department: selectedDepartment });
      toast.success(`Token ${data.data.token} called!`);
      fetchQueueData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'No patients in queue');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (patientId) => {
    try {
      await api.put(`/queue/complete/${patientId}`);
      toast.success('Patient consultation completed');
      fetchQueueData();
    } catch (error) {
      toast.error('Error completing patient');
    }
  };

  const handleSkip = async (patientId) => {
    try {
      await api.put(`/queue/skip/${patientId}`);
      toast.info('Patient skipped');
      fetchQueueData();
    } catch (error) {
      toast.error('Error skipping patient');
    }
  };

  return (
    <div className="staff-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Staff Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <div className="header-right">
          <Link to="/" className="btn btn-secondary">Home</Link>
          <Link to="/queue" className="btn btn-secondary">View All Queues</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="btn btn-secondary">Admin Panel</Link>
          )}
          <button onClick={logout} className="btn btn-danger">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="department-selector">
          <label>Select Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="form-select"
          >
            <option value="">Choose a department...</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {selectedDepartment && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <FaClock className="stat-icon" />
                <div className="stat-value">{stats.waiting}</div>
                <div className="stat-label">Waiting</div>
              </div>
              <div className="stat-card">
                <FaCheckCircle className="stat-icon success" />
                <div className="stat-value">{stats.completed}</div>
                <div className="stat-label">Completed Today</div>
              </div>
              <div className="stat-card emergency">
                <div className="stat-value">{stats.emergency}</div>
                <div className="stat-label">🚨 Emergency Cases</div>
              </div>
            </div>

            <div className="current-patient-section">
              <h2>Current Patient</h2>
              {currentToken ? (
                <div className="current-token-card">
                  <div className="current-token">{currentToken}</div>
                  <p>Currently being served</p>
                </div>
              ) : (
                <div className="no-patient">
                  <p>No patient currently being served</p>
                </div>
              )}
              <button
                onClick={handleCallNext}
                disabled={loading || patients.length === 0}
                className="btn btn-primary btn-call-next"
              >
                {loading ? 'Calling...' : 'Call Next Patient'}
              </button>
            </div>

            <div className="queue-section">
              <h2>Waiting Queue ({patients.length})</h2>
              {patients.length === 0 ? (
                <div className="empty-queue">
                  <p>No patients waiting in queue</p>
                </div>
              ) : (
                <div className="patients-list">
                  {patients.map((patient) => (
                    <div key={patient._id} className="patient-card">
                      <div className="patient-header">
                        <div className="patient-token">{patient.token}</div>
                        <span className={`priority-badge priority-${patient.priority}`}>
                          {patient.priority}
                        </span>
                      </div>
                      <div className="patient-details">
                        <div className="detail">
                          <strong>Name:</strong> {patient.name}
                        </div>
                        <div className="detail">
                          <strong>Age:</strong> {patient.age} | <strong>Gender:</strong> {patient.gender}
                        </div>
                        {patient.symptoms && (
                          <div className="detail">
                            <strong>Symptoms:</strong> {patient.symptoms}
                          </div>
                        )}
                        <div className="detail">
                          <strong>Position:</strong> #{patient.position} | 
                          <strong> Wait Time:</strong> ~{patient.estimatedWaitTime} min
                        </div>
                      </div>
                      <div className="patient-actions">
                        <button
                          onClick={() => handleComplete(patient._id)}
                          className="btn btn-success"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleSkip(patient._id)}
                          className="btn btn-warning"
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
