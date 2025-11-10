const EmergencyReport = require('../models/EmergencyReport');
const Hospital = require('../models/Hospital');
const SMSService = require('../services/smsService');

const emergencyController = {
  async createEmergency(req, res) {
    try {
      const { location, snakeSpecies, victimInfo, images } = req.body;
      
      const emergency = new EmergencyReport({
        location,
        snakeSpecies,
        victimInfo,
        images,
        reportedBy: req.user.id
      });

      await emergency.save();
      await emergency.populate('snakeSpecies', 'scientificName commonName venomType riskLevel');

      // Find nearest hospitals with antivenom
      const nearestHospitals = await Hospital.find({
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: location.coordinates
            },
            $maxDistance: 50000 // 50km radius
          }
        },
        verifiedStatus: 'VERIFIED',
        isActive: true,
        $or: [
          { 'antivenomStock.polyvalent': { $gt: 0 } },
          { 'antivenomStock.monovalent': { $gt: 0 } }
        ]
      }).limit(5);

      // Assign hospitals and attempt to send SMS alerts
      const assignedHospitals = [];
      const smsResults = [];

      for (const hospital of nearestHospitals) {
        const assignedHospital = {
          hospital: hospital._id,
          notifiedAt: new Date()
        };

        // Only send SMS if hospital has emergency contact
        const emergencyContact = hospital.contactInfo.emergency || hospital.contactInfo.phone;
        
        if (emergencyContact) {
          try {
            const message = `🚨 SNAKEBITE EMERGENCY ALERT 🚨

Species: ${emergency.snakeSpecies.commonName}
Venom Type: ${emergency.snakeSpecies.venomType}
Risk Level: ${emergency.snakeSpecies.riskLevel}
Location: ${location.address || 'Check system for coordinates'}
Time: ${new Date().toLocaleString()}

Victim Info: ${victimInfo.age ? `Age ${victimInfo.age}` : 'Age unknown'}, ${victimInfo.gender || 'Gender unknown'}
Condition: ${victimInfo.condition || 'Not specified'}

ACTION REQUIRED: Please confirm receipt and antivenom availability.

- SnaKTox Emergency System`;

            const smsResult = await SMSService.sendAlert({
              to: emergencyContact,
              message: message
            });

            smsResults.push({
              to: emergencyContact,
              messageId: smsResult.sid,
              sentAt: new Date(),
              status: smsResult.success ? 'SENT' : 'FAILED',
              mode: smsResult.mode
            });

            console.log(`📱 SMS ${smsResult.success ? 'sent' : 'failed'} to ${emergencyContact}`);

          } catch (smsError) {
            console.error('SMS sending error for hospital:', hospital.name, smsError);
            smsResults.push({
              to: emergencyContact,
              message: 'Failed to send',
              sentAt: new Date(),
              status: 'FAILED',
              error: smsError.message
            });
          }
        } else {
          console.warn(`No emergency contact for hospital: ${hospital.name}`);
          smsResults.push({
            to: 'No contact available',
            status: 'SKIPPED',
            reason: 'No emergency contact number'
          });
        }

        assignedHospitals.push(assignedHospital);
      }

      // Update emergency with assigned hospitals and SMS results
      emergency.assignedHospitals = assignedHospitals;
      emergency.smsAlerts = smsResults;
      await emergency.save();

      // Prepare response
      const response = {
        success: true,
        message: 'Emergency report created successfully',
        data: {
          emergency: {
            id: emergency._id,
            status: emergency.status,
            snakeSpecies: emergency.snakeSpecies,
            location: emergency.location,
            createdAt: emergency.createdAt
          },
          response: {
            hospitalsNotified: assignedHospitals.length,
            smsAlerts: {
              attempted: smsResults.length,
              successful: smsResults.filter(r => r.status === 'SENT').length,
              failed: smsResults.filter(r => r.status === 'FAILED').length,
              skipped: smsResults.filter(r => r.status === 'SKIPPED').length
            },
            smsServiceStatus: SMSService.getStatus()
          }
        }
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create emergency error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating emergency report: ' + error.message
      });
    }
  },

  async getEmergencies(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query = { reportedBy: req.user.id };
      
      if (status) query.status = status;

      const emergencies = await EmergencyReport.find(query)
        .populate('snakeSpecies', 'scientificName commonName venomType riskLevel')
        .populate('assignedHospitals.hospital', 'name location contactInfo')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await EmergencyReport.countDocuments(query);

      res.json({
        success: true,
        data: {
          emergencies,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            hasNext: page * limit < total,
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Get emergencies error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching emergency reports'
      });
    }
  },

  async getEmergencyById(req, res) {
    try {
      const emergency = await EmergencyReport.findById(req.params.id)
        .populate('snakeSpecies')
        .populate('assignedHospitals.hospital')
        .populate('reportedBy', 'profile firstName lastName email');

      if (!emergency) {
        return res.status(404).json({
          success: false,
          message: 'Emergency report not found'
        });
      }

      // Check if user owns this emergency or is admin
      if (emergency.reportedBy._id.toString() !== req.user.id && !['ADMIN', 'MODERATOR'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      res.json({
        success: true,
        data: { emergency }
      });
    } catch (error) {
      console.error('Get emergency error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching emergency report'
      });
    }
  },

  async updateEmergencyStatus(req, res) {
    try {
      const { status, notes } = req.body;
      
      const emergency = await EmergencyReport.findById(req.params.id);
      
      if (!emergency) {
        return res.status(404).json({
          success: false,
          message: 'Emergency report not found'
        });
      }

      // Check permissions
      if (emergency.reportedBy.toString() !== req.user.id && !['ADMIN', 'MODERATOR'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      emergency.status = status;
      if (notes) emergency.adminNotes = notes;
      if (status === 'RESOLVED') emergency.resolvedAt = new Date();
      
      await emergency.save();

      res.json({
        success: true,
        message: 'Emergency status updated successfully',
        data: { emergency }
      });
    } catch (error) {
      console.error('Update emergency status error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating emergency status'
      });
    }
  },

  async assignHospital(req, res) {
    try {
      const { hospitalId } = req.body;
      
      const emergency = await EmergencyReport.findById(req.params.id);
      const hospital = await Hospital.findById(hospitalId);

      if (!emergency || !hospital) {
        return res.status(404).json({
          success: false,
          message: 'Emergency report or hospital not found'
        });
      }

      // Check if hospital is already assigned
      const isAlreadyAssigned = emergency.assignedHospitals.some(
        ah => ah.hospital.toString() === hospitalId
      );

      if (isAlreadyAssigned) {
        return res.status(400).json({
          success: false,
          message: 'Hospital is already assigned to this emergency'
        });
      }

      // Assign hospital
      emergency.assignedHospitals.push({
        hospital: hospitalId,
        notifiedAt: new Date()
      });

      await emergency.save();

      res.json({
        success: true,
        message: 'Hospital assigned successfully',
        data: { emergency }
      });
    } catch (error) {
      console.error('Assign hospital error:', error);
      res.status(500).json({
        success: false,
        message: 'Error assigning hospital'
      });
    }
  }
};

module.exports = emergencyController;