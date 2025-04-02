// routes/thumbnail.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Readable } = require('stream');
const mongoose = require('mongoose');

// Models
const Thumbnail = require('../models/Thumbnail');
const Asset = require('../models/Assets'); // if needed to verify asset existence

// Multer in-memory setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ─────────────────────────────────────────────────────────────
// 1) GET /thumbnail
//    Returns an array of all thumbnail docs in JSON
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const thumbs = await Thumbnail.find();
    // Optional: .populate('assetId') if you want to see asset details
    // e.g. const thumbs = await Thumbnail.find().populate('assetId');
    return res.json(thumbs);
  } catch (err) {
    console.error('Error fetching thumbnails:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// 2) GET /thumbnail/:id
//    Returns a single thumbnail doc by _id (metadata only, not the file)
// ─────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const thumbDoc = await Thumbnail.findById(req.params.id);
    if (!thumbDoc) {
      return res.status(404).json({ error: 'Thumbnail not found' });
    }
    return res.json(thumbDoc);
  } catch (err) {
    console.error('Error fetching thumbnail doc:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// 3) GET /thumbnail/view/:id
//    Streams the actual image for <img src="..."> usage
// ─────────────────────────────────────────────────────────────
router.get('/view/:id', async (req, res) => {
  try {
    const thumbDoc = await Thumbnail.findById(req.params.id);
    if (!thumbDoc) {
      return res.status(404).json({ error: 'Thumbnail not found' });
    }

    // Create a GridFS bucket for "thumbnails"
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'thumbnails',
    });

    // Open a download stream
    const downloadStream = bucket.openDownloadStream(thumbDoc.fileId);

    // (Optional) set the content type based on your file extension or store in doc
    // e.g. res.set('Content-Type', 'image/jpeg');

    downloadStream.on('error', (error) => {
      console.error('GridFS download error:', error);
      return res.status(500).json({ error: 'Error streaming file' });
    });

    // Stream to response
    downloadStream.pipe(res);
  } catch (err) {
    console.error('Error streaming thumbnail:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// 4) POST /thumbnail
//    Creates a new thumbnail doc + file in GridFS
//    Requires: assetId, imageFile in FormData
// ─────────────────────────────────────────────────────────────
router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { assetId } = req.body;
    if (!assetId) {
      return res.status(400).json({ error: 'assetId is required' });
    }

    // (Optional) verify asset exists
    const assetDoc = await Asset.findById(assetId);
    if (!assetDoc) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Create the GridFS bucket
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'thumbnails',
    });

    // Convert buffer to stream
    const readableFile = new Readable();
    readableFile.push(req.file.buffer);
    readableFile.push(null);

    // The file name
    const fileName = req.file.originalname || `thumbnail-${Date.now()}`;
    const uploadStream = bucket.openUploadStream(fileName);

    uploadStream.on('error', (error) => {
      console.error('GridFS Upload Error:', error);
      return res.status(500).json({ error: 'Error uploading file' });
    });

    uploadStream.on('finish', async () => {
      try {
        // Create doc referencing asset and new file
        const newThumb = new Thumbnail({
          assetId: assetId,
          fileId: uploadStream.id,
          originalFileName: fileName,
        });
        const savedThumb = await newThumb.save();

        return res.status(201).json({
          message: 'Thumbnail uploaded successfully',
          thumbnail: savedThumb,
        });
      } catch (metaErr) {
        console.error('Error saving thumbnail doc:', metaErr);
        return res.status(500).json({ error: 'Error saving thumbnail doc' });
      }
    });

    // Pipe the data into GridFS
    readableFile.pipe(uploadStream);
  } catch (err) {
    console.error('Thumbnail route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// 5) PUT /thumbnail/:id
//    Replaces the file in GridFS for the existing doc,
//    keeping the same doc _id. Old file is deleted from GridFS.
// ─────────────────────────────────────────────────────────────
router.put('/:id', upload.single('imageFile'), async (req, res) => {
  try {
    const thumbId = req.params.id;
    const thumbDoc = await Thumbnail.findById(thumbId);
    if (!thumbDoc) {
      return res.status(404).json({ error: 'Thumbnail doc not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No new file provided' });
    }

    // GridFS bucket
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'thumbnails',
    });

    // Remove old file
    const oldFileId = thumbDoc.fileId;
    try {
      await bucket.delete(oldFileId);
    } catch (deleteErr) {
      console.error('Error deleting old file from GridFS:', deleteErr);
      // not necessarily fatal, proceed
    }

    // Upload new file
    const readableFile = new Readable();
    readableFile.push(req.file.buffer);
    readableFile.push(null);

    const fileName = req.file.originalname || `thumbnail-${Date.now()}`;
    const uploadStream = bucket.openUploadStream(fileName);

    uploadStream.on('error', (error) => {
      console.error('GridFS upload error:', error);
      return res.status(500).json({ error: 'Error uploading new file' });
    });

    uploadStream.on('finish', async () => {
      try {
        // Update doc with new fileId and filename
        thumbDoc.fileId = uploadStream.id;
        thumbDoc.originalFileName = fileName;
        await thumbDoc.save();

        return res.status(200).json({
          message: 'Thumbnail replaced successfully',
          thumbnail: thumbDoc,
        });
      } catch (metaErr) {
        console.error('Error saving updated doc:', metaErr);
        return res.status(500).json({ error: 'Error saving updated doc' });
      }
    });

    readableFile.pipe(uploadStream);
  } catch (err) {
    console.error('Error editing thumbnail:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// 6) DELETE /thumbnail/:id
//    Removes the doc + file from GridFS
// ─────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const thumbId = req.params.id;

    // Find the doc
    const thumbDoc = await Thumbnail.findById(thumbId);
    if (!thumbDoc) {
      return res.status(404).json({ error: 'Thumbnail not found' });
    }

    // Create bucket
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'thumbnails',
    });

    // fileId
    const fileId = thumbDoc.fileId;

    // Remove doc from collection
    await Thumbnail.deleteOne({ _id: thumbId });

    // Also delete the file in GridFS
    bucket.delete(fileId, (err) => {
      if (err) {
        console.error('Error deleting file from GridFS:', err);
        return res
          .status(500)
          .json({ error: 'Error deleting file from GridFS' });
      }
      return res
        .status(200)
        .json({ message: 'Thumbnail doc and file removed successfully' });
    });
  } catch (err) {
    console.error('Error deleting thumbnail:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
