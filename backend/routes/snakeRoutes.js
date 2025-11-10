const express = require('express');
const { 
  getSnakes, 
  getSnakeById, 
  createSnake, 
  updateSnake, 
  deleteSnake,
  identifySnake,
  getServiceStatus,
  getIdentificationHistory
} = require('../controllers/snakeController');
const { auth, adminAuth } = require('../middleware/auth');
const { handleUpload } = require('../services/uploadService');

const router = express.Router();

router.get('/', getSnakes);
router.get('/service-status', getServiceStatus);
router.get('/identification-history', auth, getIdentificationHistory);
router.get('/:id', getSnakeById);
router.post('/identify', auth, handleUpload, identifySnake);
router.post('/', auth, adminAuth, createSnake);
router.put('/:id', auth, adminAuth, updateSnake);
router.delete('/:id', auth, adminAuth, deleteSnake);

module.exports = router;