const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    // short description
    type: String,
    required: true,
    trim: true
  },
  extendedDescription: {
    // new field for extended description
    type: String,
    trim: true,
    required: false
  },
  poly: {
    type: String,
    trim: true,
    required: false
  },
  price: {
    type: String,
    trim: true,
    required: false
  },
  modelUrl: {
    type: String,
    trim: true,
    required: false
  },
  // Changed from a single string to an array of strings
  walkModelUrls: {
    type: [String],
    required: false,
    default: []
  },
  software: {
    type: String,
    trim: true,
    required: false
  },
  softwareLogo: {
    type: String,
    trim: true,
    required: false
  },
  scale: {
    type: [Number], // e.g. [1, 1, 1]
    required: false,
    default: [1, 1, 1]
  },
  rotation: {
    type: [Number], // e.g. [0, Math.PI/2, 0]
    required: false,
    default: [0, 0, 0]
  },
  technical: {
    objects: {
      type: Number,
      required: true
    },
    vertices: {
      type: Number,
      required: true
    },
    edges: {
      type: Number,
      required: true
    },
    faces: {
      type: Number,
      required: true
    },
    triangles: {
      type: Number,
      required: true
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
