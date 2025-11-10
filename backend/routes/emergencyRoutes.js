const express = require('express');
const { 
  createEmergency, 
  getEmergencies, 
  getEmergencyById, 
  updateEmergencyStatus,
  assignHospital 
} = require('../controllers/emergencyController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createEmergency);
router.get('/', auth, getEmergencies);
router.get('/:id', auth, getEmergencyById);
router.put('/:id/status', auth, updateEmergencyStatus);
router.post('/:id/assign-hospital', auth, assignHospital);

module.exports = router;