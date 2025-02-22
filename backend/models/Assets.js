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
    // e.g. "Low Poly" or "High Poly"
    required: false
  },
  price: {
    type: String,
    trim: true,
    // e.g. "$75.00"; if you prefer numeric, change to Number
    required: false
  },
  modelUrl: {
    type: String,
    trim: true,
    // e.g. "/3dfiles/camp1fire.glb"
    required: false
  },
  walkModelUrl: {
    // new field for the walking animation model
    type: String,
    trim: true,
    required: false,
    default: "" // defaults to empty string if not provided
  },
  software: {
    type: String,
    trim: true,
    // e.g. "3ds Max"
    required: false
  },
  softwareLogo: {
    type: String,
    trim: true,
    // e.g. "/SoftwareLogo/new5.png"
    required: false
  },
  scale: {
    type: [Number], // Array of numbers, e.g. [1, 1, 1]
    required: false,
    default: [1, 1, 1]
  },
  rotation: {
    type: [Number], // Array of numbers, e.g. [0, Math.PI/2, 0]
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
}, { timestamps: true }); // createdAt, updatedAt

module.exports = mongoose.model('Asset', assetSchema);
