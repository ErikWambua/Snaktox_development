const Hospital = require('../models/Hospital');

const hospitalController = {
  async getHospitals(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        verifiedStatus, 
        search,
        hasAntivenom 
      } = req.query;

      const query = { isActive: true };
      
      if (verifiedStatus) query.verifiedStatus = verifiedStatus;
      if (hasAntivenom === 'true') {
        query.$or = [
          { 'antivenomStock.polyvalent': { $gt: 0 } },
          { 'antivenomStock.monovalent': { $gt: 0 } }
        ];
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { 'location.address': { $regex: search, $options: 'i' } }
        ];
      }

      const hospitals = await Hospital.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ name: 1 });

      const total = await Hospital.countDocuments(query);

      res.json({
        success: true,
        data: {
          hospitals,
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
      console.error('Get hospitals error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching hospitals'
      });
    }
  },

  async getHospitalById(req, res) {
    try {
      const hospital = await Hospital.findById(req.params.id);
      
      if (!hospital) {
        return res.status(404).json({
          success: false,
          message: 'Hospital not found'
        });
      }

      res.json({
        success: true,
        data: { hospital }
      });
    } catch (error) {
      console.error('Get hospital error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching hospital'
      });
    }
  },

  async createHospital(req, res) {
    try {
      const hospitalData = req.body;
      const hospital = new Hospital(hospitalData);
      await hospital.save();

      res.status(201).json({
        success: true,
        message: 'Hospital created successfully',
        data: { hospital }
      });
    } catch (error) {
      console.error('Create hospital error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating hospital'
      });
    }
  },

  async updateHospital(req, res) {
    try {
      const hospital = await Hospital.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!hospital) {
        return res.status(404).json({
          success: false,
          message: 'Hospital not found'
        });
      }

      res.json({
        success: true,
        message: 'Hospital updated successfully',
        data: { hospital }
      });
    } catch (error) {
      console.error('Update hospital error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating hospital'
      });
    }
  },

  async deleteHospital(req, res) {
    try {
      const hospital = await Hospital.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!hospital) {
        return res.status(404).json({
          success: false,
          message: 'Hospital not found'
        });
      }

      res.json({
        success: true,
        message: 'Hospital deleted successfully'
      });
    } catch (error) {
      console.error('Delete hospital error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting hospital'
      });
    }
  },

  async findNearestHospitals(req, res) {
    try {
      const { lat, lng, maxDistance = 50000, limit = 10 } = req.query; // maxDistance in meters

      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          message: 'Please provide latitude and longitude'
        });
      }

      const hospitals = await Hospital.find({
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: parseInt(maxDistance)
          }
        },
        verifiedStatus: 'VERIFIED',
        isActive: true,
        $or: [
          { 'antivenomStock.polyvalent': { $gt: 0 } },
          { 'antivenomStock.monovalent': { $gt: 0 } }
        ]
      }).limit(parseInt(limit));

      // Calculate distances
      const hospitalsWithDistance = hospitals.map(hospital => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          hospital.location.coordinates[1],
          hospital.location.coordinates[0]
        );
        
        return {
          ...hospital.toObject(),
          distance: Math.round(distance / 1000) // Convert to kilometers
        };
      });

      res.json({
        success: true,
        data: {
          hospitals: hospitalsWithDistance,
          searchLocation: { lat: parseFloat(lat), lng: parseFloat(lng) },
          maxDistance: parseInt(maxDistance) / 1000 // Convert to kilometers
        }
      });
    } catch (error) {
      console.error('Find nearest hospitals error:', error);
      res.status(500).json({
        success: false,
        message: 'Error finding nearest hospitals'
      });
    }
  }
};

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = hospitalController;