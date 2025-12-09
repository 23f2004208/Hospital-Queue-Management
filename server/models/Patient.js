const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['emergency', 'high', 'medium', 'low'],
    default: 'low',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed', 'skipped'],
    default: 'waiting'
  },
  visitType: {
    type: String,
    enum: ['walk-in', 'appointment'],
    default: 'walk-in'
  },
  symptoms: {
    type: String,
    trim: true
  },
  arrivalTime: {
    type: Date,
    default: Date.now
  },
  calledTime: {
    type: Date
  },
  completedTime: {
    type: Date
  },
  estimatedWaitTime: {
    type: Number, // in minutes
    default: 0
  },
  position: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
patientSchema.index({ status: 1, arrivalTime: 1 });
patientSchema.index({ department: 1, status: 1 });

module.exports = mongoose.model('Patient', patientSchema);
