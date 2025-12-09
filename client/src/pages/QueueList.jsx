import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './QueueList.css';

const QueueList = () => {
  const { logout } = useAuth();

  return (
    <div className="queue-list-page">
      <header className="page-header">
        <h1>All Queues Overview</h1>
        <div className="header-actions">
          <Link to="/staff" className="btn btn-secondary">Back to Dashboard</Link>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>
      </header>
      <div className="page-content">
        <p>Queue list view - showing all department queues</p>
      </div>
    </div>
  );
};

export default QueueList;
