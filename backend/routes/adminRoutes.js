const express = require('express');
const { 
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  getAuditLogs,
  getAnalytics
} = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(auth, adminAuth);

router.get('/dashboard', getDashboardStats);
// Backwards-compatible redirect (301) to the canonical dashboard route
router.get('/overview', (req, res) => {
  // Redirect to the full API path so client browsers/clients follow correctly
  return res.redirect(301, '/api/admin/dashboard');
});
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/audit-logs', getAuditLogs);
router.get('/analytics', getAnalytics);

module.exports = router;