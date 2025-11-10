const express = require('express');
const SMSService = require('../services/smsService');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/status', auth, (req, res) => {
  try {
    const status = SMSService.getStatus();
    res.json({
      success: true,
      data: {
        smsService: status,
        instructions: status.isEnabled 
          ? 'SMS service is active and will send real messages in production'
          : 'SMS service is in development mode. Messages are logged but not sent.'
      }
    });
  } catch (error) {
    console.error('SMS status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting SMS service status'
    });
  }
});

module.exports = router;