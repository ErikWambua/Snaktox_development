const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['ADMIN', 'MODERATOR', 'MEDICAL_EXPERT', 'VIEWER', 'USER'],
    default: 'USER'
  },
  profile: {
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
      trim: true,
      maxlength: 50
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return /^\+?[\d\s\-\(\)]{10,}$/.test(v);
        },
        message: 'Please provide a valid phone number'
      }
    },
    institution: String,
    specialization: String,
    avatar: String
  },
  permissions: [{
    module: String,
    canRead: { type: Boolean, default: false },
    canWrite: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);