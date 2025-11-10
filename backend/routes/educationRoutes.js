const express = require('express');
const {
  getEducationMaterials,
  getEducationMaterialById,
  createEducationMaterial,
  updateEducationMaterial,
  deleteEducationMaterial,
  incrementViews,
  incrementDownloads
} = require('../controllers/educationController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getEducationMaterials);
router.get('/:id', getEducationMaterialById);
router.put('/:id/views', incrementViews);
router.put('/:id/downloads', incrementDownloads);

// Protected admin routes
router.post('/', auth, adminAuth, createEducationMaterial);
router.put('/:id', auth, adminAuth, updateEducationMaterial);
router.delete('/:id', auth, adminAuth, deleteEducationMaterial);

module.exports = router;