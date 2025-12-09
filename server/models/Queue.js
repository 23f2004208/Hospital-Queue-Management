const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  currentToken: {
    type: String,
    default: null
  },
  currentPatient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    default: null
  },
  totalServed: {
    type: Number,
    default: 0
  },
  totalWaiting: {
    type: Number,
    default: 0
  },
  avgWaitTime: {
    type: Number, // in minutes
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Compound index for department and date
queueSchema.index({ department: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Queue', queueSchema);
