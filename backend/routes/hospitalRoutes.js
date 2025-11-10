const express = require('express');
const { 
  getHospitals, 
  getHospitalById, 
  createHospital, 
  updateHospital, 
  deleteHospital,
  findNearestHospitals 
} = require('../controllers/hospitalController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getHospitals);
router.get('/nearest', findNearestHospitals);
router.get('/:id', getHospitalById);
router.post('/', auth, adminAuth, createHospital);
router.put('/:id', auth, adminAuth, updateHospital);
router.delete('/:id', auth, adminAuth, deleteHospital);

module.exports = router;