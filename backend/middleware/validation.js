const { body, validationResult } = require('express-validator');

const validateSnakeCreation = [
  body('scientificName')
    .notEmpty()
    .withMessage('Scientific name is required')
    .isLength({ min: 3 })
    .withMessage('Scientific name must be at least 3 characters long'),
  
  body('commonName')
    .notEmpty()
    .withMessage('Common name is required')
    .isLength({ min: 2 })
    .withMessage('Common name must be at least 2 characters long'),
  
  body('venomType')
    .isIn(['neurotoxic', 'hemotoxic', 'cytotoxic', 'mixed'])
    .withMessage('Invalid venom type'),
  
  body('riskLevel')
    .isIn(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
    .withMessage('Invalid risk level'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long')
];

const validateEmergencyReport = [
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]'),
  
  body('location.coordinates.*')
    .isFloat()
    .withMessage('Coordinates must be numbers'),
  
  body('snakeSpecies')
    .isMongoId()
    .withMessage('Valid snake species ID is required'),
  
  body('victimInfo.age')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('Age must be between 0 and 120'),
  
  body('victimInfo.gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateSnakeCreation,
  validateEmergencyReport,
  handleValidationErrors
};