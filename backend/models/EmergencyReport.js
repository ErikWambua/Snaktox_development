const mongoose = require('mongoose');

const emergencyReportSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: String,
    description: String
  },
  snakeSpecies: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SnakeSpecies',
    required: true
  },
  victimInfo: {
    age: Number,
    gender: String,
    condition: String,
    symptoms: [String],
    biteTime: Date
  },
  images: [{
    url: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
    default: 'PENDING'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedHospitals: [{
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    notifiedAt: Date,
    responded: {
      type: Boolean,
      default: false
    }
  }],
  smsAlerts: [{
    to: String,
    message: String,
    sentAt: Date,
    status: String
  }],
  adminNotes: String,
  resolutionNotes: String,
  resolvedAt: Date
}, {
  timestamps: true
});

// Indexes
emergencyReportSchema.index({ 'location.coordinates': '2dsphere' });
emergencyReportSchema.index({ status: 1 });
emergencyReportSchema.index({ reportedBy: 1 });
emergencyReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('EmergencyReport', emergencyReportSchema);