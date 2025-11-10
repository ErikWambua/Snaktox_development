const EducationMaterial = require('../models/EducationMaterial');

const educationController = {
  async getEducationMaterials(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        language = 'en',
        search,
        type
      } = req.query;

      const query = { isPublished: true, isActive: true };

      if (category) query.category = category;
      if (language) query.language = language;
      if (type) query.type = type;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      const materials = await EducationMaterial.find(query)
        .select('-content') // Don't send full content in list
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ publishedAt: -1 });

      const total = await EducationMaterial.countDocuments(query);

      res.json({
        success: true,
        data: {
          materials,
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
      console.error('Get education materials error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching education materials'
      });
    }
  },

  async getEducationMaterialById(req, res) {
    try {
      const material = await EducationMaterial.findById(req.params.id);

      if (!material || !material.isPublished) {
        return res.status(404).json({
          success: false,
          message: 'Education material not found'
        });
      }

      // Increment views
      material.views += 1;
      await material.save();

      res.json({
        success: true,
        data: { material }
      });
    } catch (error) {
      console.error('Get education material error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching education material'
      });
    }
  },

  async createEducationMaterial(req, res) {
    try {
      const materialData = req.body;
      
      // Set publishedAt if isPublished is true
      if (materialData.isPublished && !materialData.publishedAt) {
        materialData.publishedAt = new Date();
      }

      const material = new EducationMaterial(materialData);
      await material.save();

      res.status(201).json({
        success: true,
        message: 'Education material created successfully',
        data: { material }
      });
    } catch (error) {
      console.error('Create education material error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating education material'
      });
    }
  },

  async updateEducationMaterial(req, res) {
    try {
      const updates = req.body;

      // Update publishedAt if publishing for the first time
      if (updates.isPublished && !updates.publishedAt) {
        const existingMaterial = await EducationMaterial.findById(req.params.id);
        if (existingMaterial && !existingMaterial.isPublished) {
          updates.publishedAt = new Date();
        }
      }

      const material = await EducationMaterial.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
      );

      if (!material) {
        return res.status(404).json({
          success: false,
          message: 'Education material not found'
        });
      }

      res.json({
        success: true,
        message: 'Education material updated successfully',
        data: { material }
      });
    } catch (error) {
      console.error('Update education material error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating education material'
      });
    }
  },

  async deleteEducationMaterial(req, res) {
    try {
      const material = await EducationMaterial.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!material) {
        return res.status(404).json({
          success: false,
          message: 'Education material not found'
        });
      }

      res.json({
        success: true,
        message: 'Education material deleted successfully'
      });
    } catch (error) {
      console.error('Delete education material error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting education material'
      });
    }
  },

  async incrementViews(req, res) {
    try {
      const material = await EducationMaterial.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
      );

      if (!material) {
        return res.status(404).json({
          success: false,
          message: 'Education material not found'
        });
      }

      res.json({
        success: true,
        data: { views: material.views }
      });
    } catch (error) {
      console.error('Increment views error:', error);
      res.status(500).json({
        success: false,
        message: 'Error incrementing views'
      });
    }
  },

  async incrementDownloads(req, res) {
    try {
      const material = await EducationMaterial.findByIdAndUpdate(
        req.params.id,
        { $inc: { downloads: 1 } },
        { new: true }
      );

      if (!material) {
        return res.status(404).json({
          success: false,
          message: 'Education material not found'
        });
      }

      res.json({
        success: true,
        data: { downloads: material.downloads }
      });
    } catch (error) {
      console.error('Increment downloads error:', error);
      res.status(500).json({
        success: false,
        message: 'Error incrementing downloads'
      });
    }
  }
};

module.exports = educationController;