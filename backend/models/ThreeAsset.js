// models/ThreeAsset.js

const mongoose = require('mongoose');

const ThreeSchema = new mongoose.Schema({
  // Reference to the _id from the Asset model
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',  // 'Asset' matches what you exported in your Asset model
    required: true,
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // Stores the original file name (with extension)
  originalFileName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('ThreeAsset', ThreeSchema);
