const mongoose = require('mongoose');

const snakeSchema = new mongoose.Schema({
  scientificName: {
    type: String,
    required: [true, 'Scientific name is required'],
    unique: true,
    trim: true
  },
  commonName: {
    type: String,
    required: [true, 'Common name is required'],
    trim: true
  },
  localNames: [{
    type: String,
    trim: true
  }],
  venomType: {
    type: String,
    enum: ['neurotoxic', 'hemotoxic', 'cytotoxic', 'mixed'],
    required: [true, 'Venom type is required']
  },
  region: {
    type: String,
    default: 'East Africa'
  },
  riskLevel: {
    type: String,
    enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
    required: [true, 'Risk level is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  habitat: String,
  behavior: String,
  firstAid: [String],
  medicalTreatment: [String],
  images: [{
    url: String,
    isPrimary: Boolean,
    credit: String
  }],
  verifiedBy: {
    name: String,
    institution: String,
    date: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
snakeSchema.index({ scientificName: 1 });
snakeSchema.index({ commonName: 1 });
snakeSchema.index({ venomType: 1 });
snakeSchema.index({ riskLevel: 1 });
snakeSchema.index({ region: 1 });

module.exports = mongoose.model('SnakeSpecies', snakeSchema);