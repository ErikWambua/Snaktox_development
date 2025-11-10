const mongoose = require('mongoose');

const educationMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    enum: ['prevention', 'first-aid', 'treatment', 'species', 'emergency', 'general'],
    required: [true, 'Category is required']
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'sw', 'fr', 'so', 'am']
  },
  type: {
    type: String,
    enum: ['article', 'video', 'pdf', 'infographic', 'guide'],
    default: 'article'
  },
  author: {
    name: String,
    institution: String,
    credentials: String
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: Boolean
  }],
  attachments: [{
    name: String,
    url: String,
    fileType: String,
    fileSize: Number
  }],
  videoUrl: String,
  duration: String, // for videos
  pages: Number, // for PDFs
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  verifiedBy: {
    name: String,
    institution: String,
    date: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
educationMaterialSchema.index({ category: 1, isPublished: 1 });
educationMaterialSchema.index({ language: 1, isPublished: 1 });
educationMaterialSchema.index({ tags: 1 });
educationMaterialSchema.index({ isPublished: 1, publishedAt: -1 });

module.exports = mongoose.model('EducationMaterial', educationMaterialSchema);