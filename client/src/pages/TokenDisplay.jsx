import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { connectSocket } from '../utils/socket';
import './TokenDisplay.css';

const TokenDisplay = () => {
  const [queues, setQueues] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchQueues();
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch queues every 5 seconds
    const queueInterval = setInterval(fetchQueues, 5000);

    // Setup socket connection
    const socket = connectSocket();
    
    socket.on('queue:updated', () => {
      fetchQueues();
    });

    socket.on('token:called', () => {
      fetchQueues();
    });

    return () => {
      clearInterval(timeInterval);
      clearInterval(queueInterval);
    };
  }, []);

  const fetchQueues = async () => {
    try {
      const { data } = await api.get('/queue/status/live');
      setQueues(data.data);
    } catch (error) {
      console.error('Error fetching queues:', error);
    }
  };

  return (
    <div className="display-page">
      <header className="display-header">
        <div className="hospital-name">
          <h1>🏥 Sunrise Multispeciality Hospital</h1>
          <p className="tagline">Intelligent Queue Management System</p>
        </div>
        <div className="current-time">
          <div className="time">{currentTime.toLocaleTimeString()}</div>
          <div className="date">{currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
        </div>
      </header>

      <div className="display-content">
        <div className="queue-grid">
          {queues.map((queue) => (
            <div key={queue.department} className="department-card">
              <div className="department-header">
                <h2>{queue.department}</h2>
                {queue.emergencyCount > 0 && (
                  <span className="emergency-indicator">
                    🚨 {queue.emergencyCount} Emergency
                  </span>
                )}
              </div>

              <div className="current-token-display">
                <div className="label">NOW SERVING</div>
                <div className="token-number">
                  {queue.currentToken || '---'}
                </div>
              </div>

              <div className="queue-stats">
                <div className="stat">
                  <span className="stat-value">{queue.totalWaiting}</span>
                  <span className="stat-label">Waiting</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{queue.totalServed}</span>
                  <span className="stat-label">Served</span>
                </div>
              </div>

              <div className={`status-indicator status-${queue.status}`}>
                {queue.status === 'active' ? '🟢 Active' : 
                 queue.status === 'paused' ? '🟡 Paused' : 
                 '🔴 Closed'}
              </div>
            </div>
          ))}
        </div>

        {queues.length === 0 && (
          <div className="no-queues">
            <p>No active queues at the moment</p>
          </div>
        )}
      </div>

      <footer className="display-footer">
        <div className="footer-info">
          <p>🔔 Please listen for your token number announcement</p>
          <p>📱 Check your token status: <Link to="/">Go to Homepage</Link></p>
        </div>
      </footer>
    </div>
  );
};

export default TokenDisplay;
