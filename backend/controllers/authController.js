const User = require('../models/User');

const authController = {
  async register(req, res) {
    try {
      const { email, password, profile, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create new user
      const user = new User({
        email,
        password,
        profile,
        role: role || 'USER'
      });

      await user.save();

      // Generate token
      const token = user.generateAuthToken();

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            profile: user.profile
          },
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering user',
        error: error.message
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      const user = await User.findByCredentials(email, password);
      const token = user.generateAuthToken();

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            profile: user.profile
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching profile'
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const updates = req.body;
      const allowedUpdates = ['profile', 'email'];
      const isValidOperation = Object.keys(updates).every(update => 
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).json({
          success: false,
          message: 'Invalid updates'
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true, runValidators: true }
      ).select('-password');

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating profile'
      });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide current and new password'
        });
      }

      const user = await User.findById(req.user.id).select('+password');
      const isMatch = await user.comparePassword(currentPassword);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Error changing password'
      });
    }
  }
};

module.exports = authController;