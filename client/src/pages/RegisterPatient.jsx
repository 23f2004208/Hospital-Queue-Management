import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './RegisterPatient.css';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    priority: 'low',
    department: '',
    symptoms: '',
    visitType: 'walk-in'
  });

  const departments = [
    'Cardiology',
    'Orthopedics',
    'Pediatrics',
    'General Medicine',
    'Neurology',
    'Dermatology',
    'ENT',
    'Ophthalmology'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting registration with data:', formData);
      const { data } = await api.post('/patients/register', formData);
      
      console.log('Registration response:', data);
      toast.success('Registration successful! Your token: ' + data.data.token);
      
      // Navigate to status page
      setTimeout(() => {
        navigate(`/status/${data.data.token}`);
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Patient Registration</h1>
      </div>

      <div className="register-container">
        <div className="register-card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age *</label>
                <input
                  type="number"
                  name="age"
                  className="form-input"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="0"
                  max="150"
                  placeholder="Age"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level *</label>
              <div className="priority-options">
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="emergency"
                    checked={formData.priority === 'emergency'}
                    onChange={handleChange}
                  />
                  <span className="priority-emergency">🚨 Emergency</span>
                </label>
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={formData.priority === 'high'}
                    onChange={handleChange}
                  />
                  <span className="priority-high">⚠️ High</span>
                </label>
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="medium"
                    checked={formData.priority === 'medium'}
                    onChange={handleChange}
                  />
                  <span className="priority-medium">📋 Medium</span>
                </label>
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={formData.priority === 'low'}
                    onChange={handleChange}
                  />
                  <span className="priority-low">✅ Low</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Symptoms / Reason for Visit</label>
              <textarea
                name="symptoms"
                className="form-textarea"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe your symptoms or reason for visit..."
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-register"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register & Get Token'}
            </button>
          </form>
        </div>

        <div className="info-sidebar">
          <div className="info-card">
            <h3>📋 Registration Guidelines</h3>
            <ul>
              <li>Fill all required fields marked with *</li>
              <li>Provide accurate contact information</li>
              <li>Select appropriate priority level</li>
              <li>Emergency cases will be prioritized</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>⏱️ Expected Wait Times</h3>
            <ul>
              <li><strong>Emergency:</strong> Immediate</li>
              <li><strong>High:</strong> ~5 minutes</li>
              <li><strong>Medium:</strong> ~15 minutes</li>
              <li><strong>Low:</strong> ~30 minutes</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>💡 What's Next?</h3>
            <ul>
              <li>You'll receive a unique token number</li>
              <li>Wait for your turn in the waiting area</li>
              <li>Watch the display for your token</li>
              <li>Proceed when called</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPatient;
