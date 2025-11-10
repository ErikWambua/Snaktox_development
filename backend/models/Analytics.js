const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  metrics: {
    emergencyReports: {
      type: Number,
      default: 0
    },
    snakeIdentifications: {
      type: Number,
      default: 0
    },
    hospitalSearches: {
      type: Number,
      default: 0
    },
    educationalViews: {
      type: Number,
      default: 0
    },
    successfulRescues: {
      type: Number,
      default: 0
    },
    smsAlertsSent: {
      type: Number,
      default: 0
    }
  },
  regionalData: [{
    region: String,
    emergencyCount: Number,
    commonSnakeSpecies: [String]
  }],
  performance: {
    averageResponseTime: Number,
    systemUptime: Number,
    errorRate: Number
  }
}, {
  timestamps: true
});

// Index for date-based queries
analyticsSchema.index({ date: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);