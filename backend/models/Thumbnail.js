// models/Thumbnail.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThumbnailSchema = new Schema({
  assetId: {
    type: Schema.Types.ObjectId,
    ref: 'Asset',  // references your existing Asset model
    required: true,
  },
  fileId: {
    // The _id from the GridFS "files" collection
    type: Schema.Types.ObjectId,
    required: true,
  },
  originalFileName: {
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Thumbnail', ThumbnailSchema);
