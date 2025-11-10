const User = require('../models/User');
const EmergencyReport = require('../models/EmergencyReport');
const Hospital = require('../models/Hospital');
const SnakeSpecies = require('../models/SnakeSpecies');
const AuditLog = require('../models/AuditLog');
const Analytics = require('../models/Analytics');

const adminController = {
  async getDashboardStats(req, res) {
    try {
      const [
        totalUsers,
        totalEmergencies,
        totalHospitals,
        totalSnakes,
        recentEmergencies,
        pendingEmergencies
      ] = await Promise.all([
        User.countDocuments(),
        EmergencyReport.countDocuments(),
        Hospital.countDocuments({ isActive: true }),
        SnakeSpecies.countDocuments({ isActive: true }),
        EmergencyReport.find().sort({ createdAt: -1 }).limit(5)
          .populate('snakeSpecies', 'commonName venomType')
          .populate('reportedBy', 'profile firstName lastName'),
        EmergencyReport.countDocuments({ status: 'PENDING' })
      ]);

      res.json({
        success: true,
        data: {
          stats: {
            totalUsers,
            totalEmergencies,
            totalHospitals,
            totalSnakes,
            pendingEmergencies
          },
          recentEmergencies
        }
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard statistics'
      });
    }
  },

  async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, role, search } = req.query;
      
      const query = {};
      if (role) query.role = role;
      if (search) {
        query.$or = [
          { 'profile.firstName': { $regex: search, $options: 'i' } },
          { 'profile.lastName': { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .select('-password')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalCount: total
          }
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching users'
      });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const allowedUpdates = ['role', 'isActive', 'permissions', 'profile'];
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
        id,
        updates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Log the action
      await AuditLog.create({
        action: 'UPDATE_USER',
        module: 'ADMIN',
        user: req.user.id,
        userEmail: req.user.email,
        resourceId: user._id,
        resourceType: 'User',
        afterState: user
      });

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating user'
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Log the action
      await AuditLog.create({
        action: 'DELETE_USER',
        module: 'ADMIN',
        user: req.user.id,
        userEmail: req.user.email,
        resourceId: user._id,
        resourceType: 'User'
      });

      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deactivating user'
      });
    }
  },

  async getAuditLogs(req, res) {
    try {
      const { page = 1, limit = 20, action, module, startDate, endDate } = req.query;
      
      const query = {};
      if (action) query.action = action;
      if (module) query.module = module;
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      const logs = await AuditLog.find(query)
        .populate('user', 'email profile.firstName profile.lastName')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ timestamp: -1 });

      const total = await AuditLog.countDocuments(query);

      res.json({
        success: true,
        data: {
          logs,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalCount: total
          }
        }
      });
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching audit logs'
      });
    }
  },

  async getAnalytics(req, res) {
    try {
      const { period = '7d' } = req.query; // 7d, 30d, 90d
      
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      // Get emergency reports by date
      const emergenciesByDate = await EmergencyReport.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Get emergencies by status
      const emergenciesByStatus = await EmergencyReport.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      // Get top snake species
      const topSnakes = await EmergencyReport.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: "$snakeSpecies",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]).lookup({
        from: 'snakespecies',
        localField: '_id',
        foreignField: '_id',
        as: 'snakeDetails'
      });

      res.json({
        success: true,
        data: {
          period: {
            start: startDate,
            end: endDate
          },
          emergenciesByDate,
          emergenciesByStatus,
          topSnakes
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching analytics'
      });
    }
  }
};

module.exports = adminController;