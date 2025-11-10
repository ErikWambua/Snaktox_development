const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 &&
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    },
    address: String,
    country: {
      type: String,
      default: 'KE'
    }
  },
  verifiedStatus: {
    type: String,
    enum: ['VERIFIED', 'PENDING', 'UNVERIFIED'],
    default: 'PENDING'
  },
  contactInfo: {
    phone: String,
    emergency: String,
    email: String,
    website: String
  },
  antivenomStock: {
    polyvalent: {
      type: Number,
      default: 0,
      min: 0
    },
    monovalent: {
      type: Number,
      default: 0,
      min: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  specialties: [String],
  operatingHours: {
    emergency: String,
    general: String
  },
  emergencyServices: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create geospatial index
hospitalSchema.index({ 'location.coordinates': '2dsphere' });
hospitalSchema.index({ verifiedStatus: 1 });
hospitalSchema.index({ name: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);