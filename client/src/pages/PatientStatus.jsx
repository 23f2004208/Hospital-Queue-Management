import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { connectSocket } from '../utils/socket';
import './PatientStatus.css';

const PatientStatus = () => {
  const { token } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientStatus();

    // Setup socket for real-time updates
    const socket = connectSocket();
    
    socket.on('queue:updated', (data) => {
      if (patient && data.department === patient.department) {
        fetchPatientStatus();
      }
    });

    socket.on('token:called', (data) => {
      if (data.patient.token === token) {
        toast.info('Your token has been called! Please proceed to the consultation room.');
        fetchPatientStatus();
      }
    });

    const interval = setInterval(fetchPatientStatus, 10000); // Refresh every 10 seconds

    return () => {
      clearInterval(interval);
    };
  }, [token]);

  const fetchPatientStatus = async () => {
    try {
      const { data } = await api.get(`/patients/token/${token}`);
      setPatient(data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Token not found');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="status-page">
        <div className="status-container">
          <div className="error-card">
            <h2>Token Not Found</h2>
            <p>The token {token} was not found in our system.</p>
            <Link to="/register" className="btn btn-primary">Register New Patient</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="status-page">
      <div className="status-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Patient Status</h1>
      </div>

      <div className="status-container">
        <div className="status-card">
          <div className="token-display">
            <div className="token-label">Your Token</div>
            <div className="token-value">{patient.token}</div>
          </div>

          <div className="patient-info">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{patient.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Department:</span>
              <span className="value">{patient.department}</span>
            </div>
            <div className="info-row">
              <span className="label">Priority:</span>
              <span className={`priority-badge priority-${patient.priority}`}>
                {patient.priority.toUpperCase()}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`status-badge status-${patient.status}`}>
                {patient.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="queue-info">
            {patient.status === 'waiting' && (
              <>
                <div className="position-display">
                  <div className="position-label">Your Position</div>
                  <div className="position-value">{patient.position}</div>
                </div>
                <div className="wait-time">
                  <span>Estimated Wait Time:</span>
                  <span className="time-value">{patient.estimatedWaitTime} minutes</span>
                </div>
              </>
            )}

            {patient.status === 'in-progress' && (
              <div className="status-message in-progress">
                <h3>🩺 In Consultation</h3>
                <p>You are currently being attended to.</p>
              </div>
            )}

            {patient.status === 'completed' && (
              <div className="status-message completed">
                <h3>✅ Consultation Completed</h3>
                <p>Thank you for visiting Sunrise Hospital!</p>
              </div>
            )}

            {patient.status === 'skipped' && (
              <div className="status-message skipped">
                <h3>⚠️ Token Skipped</h3>
                <p>Please contact the front desk.</p>
              </div>
            )}
          </div>

          <div className="arrival-info">
            <p>Arrival Time: {new Date(patient.arrivalTime).toLocaleString()}</p>
          </div>
        </div>

        <div className="instructions-card">
          <h3>📋 Instructions</h3>
          <ul>
            <li>Please stay in the waiting area</li>
            <li>Keep an eye on the display screen</li>
            <li>Listen for token announcements</li>
            <li>When called, proceed to the consultation room</li>
            <li>This page auto-refreshes every 10 seconds</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatientStatus;
