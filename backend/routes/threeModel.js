// routes/threeModel.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Readable } = require('stream');
const mongoose = require('mongoose');

const ThreeAsset = require('../models/ThreeAsset'); // updated model
const Asset = require('../models/Assets');           // so we can verify existence

// 1) Multer setup: store file in memory as a Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 2) Test Form Route (GET /threeModel/test-upload-form)
router.get('/test-upload-form', (req, res) => {
  const htmlForm = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>GridFS Upload Test</title>
    </head>
    <body>
      <h1>Upload a 3D Model to GridFS</h1>
      <form action="/threeModel" method="POST" enctype="multipart/form-data">
        <div>
          <label for="assetId">Asset ID (ObjectId from Asset collection):</label>
          <input type="text" name="assetId" id="assetId" required />
        </div>
        <div>
          <label for="modelFile">3D Model File:</label>
          <input type="file" name="modelFile" id="modelFile" required />
        </div>
        <button type="submit">Upload</button>
      </form>
    </body>
  </html>
  `;
  res.send(htmlForm);
});

// 3) POST /threeModel
//    Upload file to GridFS, then store reference + file name in `ThreeAsset` collection
router.post('/', upload.single('modelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { assetId } = req.body;

    // Validate that assetId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(assetId)) {
      return res.status(400).json({ error: 'Invalid assetId. Must be a MongoDB ObjectId.' });
    }

    // (Optional) Verify that this Asset actually exists
    const assetDoc = await Asset.findById(assetId);
    if (!assetDoc) {
      return res.status(404).json({ error: `No Asset found with _id = ${assetId}` });
    }

    // Create a GridFS Bucket
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'threeModels', // you can name this anything
    });

    // Convert the in-memory buffer to a readable stream
    const readableFile = new Readable();
    readableFile.push(req.file.buffer);
    readableFile.push(null);

    // Use the original file name (req.file.originalname) for reference
    const fileName = req.file.originalname || `3d-model-${Date.now()}`;

    // Open upload stream
    const uploadStream = bucket.openUploadStream(fileName);

    // Pipe the file into GridFS
    readableFile.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('Error uploading to GridFS:', error);
      return res.status(500).json({ error: 'Error uploading file' });
    });

    uploadStream.on('finish', async () => {
      try {
        // `uploadStream.id` is the _id of the file in the threeModels.files collection
        const newThreeDoc = new ThreeAsset({
          assetId: assetId,          // reference to the existing Asset document
          fileId: uploadStream.id,   // reference to GridFS file
          originalFileName: fileName // store original file name
        });

        const savedDoc = await newThreeDoc.save();

        res.status(201).json({
          message: '3D model uploaded to GridFS successfully',
          data: savedDoc,
        });
      } catch (error) {
        console.error('Error saving metadata:', error);
        res.status(500).json({ error: 'Error saving metadata' });
      }
    });
  } catch (error) {
    console.error('Error uploading 3D model:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4) GET /threeModel
//    Retrieve all metadata from the `ThreeAsset` collection
//    Optionally, populate to see details of the linked Asset
router.get('/', async (req, res) => {
  try {
    const allModels = await ThreeAsset.find().populate('assetId');
    // If you don't want to populate, just use: ThreeAsset.find() instead
    res.status(200).json(allModels);
  } catch (error) {
    console.error('Error fetching 3D models:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5) GET /threeModel/download/:id
//    Download/stream the original file from GridFS
router.get('/download/:id', async (req, res) => {
  try {
    // Find the metadata doc in our Mongoose collection
    const modelDoc = await ThreeAsset.findById(req.params.id);
    if (!modelDoc) {
      return res
        .status(404)
        .json({ error: 'Model not found in ThreeAsset collection.' });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'threeModels',
    });

    // Open a download stream using the fileId
    const downloadStream = bucket.openDownloadStream(modelDoc.fileId);

    downloadStream.on('error', (error) => {
      console.error('Error downloading from GridFS:', error);
      return res.status(500).json({ error: 'Error downloading file' });
    });

    // Use the stored originalFileName as the download name
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename="${modelDoc.originalFileName}"`);

    // Pipe the file to the response
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error in download route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /threeModel/view/:id
// Streams the file so it can be used directly by three.js or <model-viewer> in the browser
router.get('/view/:id', async (req, res) => {
  try {
    // 1) Lookup your metadata document
    const modelDoc = await ThreeAsset.findById(req.params.id);
    if (!modelDoc) {
      return res.status(404).json({ error: 'Model not found' });
    }

    // 2) Create GridFS bucket
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'threeModels',
    });

    // 3) Determine the MIME type from the file extension
    let contentType = 'application/octet-stream'; // fallback
    if (modelDoc.originalFileName.endsWith('.gltf')) {
      contentType = 'model/gltf+json';
    } else if (modelDoc.originalFileName.endsWith('.glb')) {
      contentType = 'model/gltf-binary';
    }
    // you can add more checks for other 3D file types, e.g., .fbx, .obj, etc.

    // 4) Open a download stream from GridFS
    const downloadStream = bucket.openDownloadStream(modelDoc.fileId);

    // 5) Set the content type so the client can parse it properly
    res.set('Content-Type', contentType);

    // 6) Pipe the file to the response
    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      console.error('GridFS streaming error:', err);
      res.status(500).json({ error: 'Error streaming file' });
    });
  } catch (err) {
    console.error('Error in /view route:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /threeModel/viewer/:id
// Generates an HTML page with a Three.js viewer for the model
router.get('/viewer/:id', async (req, res) => {
  const modelId = req.params.id;

  const htmlPage = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>3D Model Viewer</title>
      <style>
        body { margin: 0; padding: 0; }
        #canvas-container { width: 100vw; height: 100vh; }
        canvas { display: block; }
      </style>
    </head>
    <body>
      <div id="canvas-container"></div>
      <script src="https://cdn.jsdelivr.net/npm/three@latest/build/three.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@latest/examples/js/loaders/GLTFLoader.js"></script>
      <script>
        const modelId = "${modelId}";
        const modelURL = "/threeModel/view/" + modelId;

        let scene, camera, renderer, loader;

        function init() {
          scene = new THREE.Scene();
          scene.background = new THREE.Color(0x202020);

          camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
          );
          camera.position.set(0, 2, 5);

          renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          document.getElementById('canvas-container').appendChild(renderer.domElement);

          const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
          scene.add(ambientLight);

          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
          directionalLight.position.set(5, 10, 7.5);
          scene.add(directionalLight);

          loader = new THREE.GLTFLoader();
          loader.load(
            modelURL,
            function (gltf) {
              scene.add(gltf.scene);
              console.log("Model loaded successfully");
            },
            function (xhr) {
              console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
              console.error('An error happened while loading the model:', error);
            }
          );

          window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        }

        init();
        animate();
      </script>
    </body>
  </html>
  `;
  res.send(htmlPage);
});

module.exports = router;
