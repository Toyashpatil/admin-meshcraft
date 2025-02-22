const express = require('express');
const Asset = require('../models/Assets');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.send("Hello");
});

// CREATE asset
router.post('/assets', async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      title,
      description,
      extendedDescription,
      poly,
      price,
      modelUrl,
      walkModelUrl, // NEW field
      software,
      softwareLogo,
      scale,
      rotation,
      technical
    } = req.body;

    // Basic validation: require title, description, and technical
    if (!title || !description || !technical) {
      return res
        .status(400)
        .json({ message: "Title, description, and technical details are required" });
    }

    // Create a new asset
    const newAsset = new Asset({
      title,
      description,
      extendedDescription,
      poly,
      price,
      modelUrl,
      walkModelUrl, // include walkModelUrl
      software,
      softwareLogo,
      scale,
      rotation,
      technical
    });

    // Save to MongoDB
    await newAsset.save();

    res.status(201).json({ message: "3D asset created successfully", asset: newAsset });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// READ all assets
router.get('/assets', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json({ assets });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// UPDATE asset
router.put('/assets/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      extendedDescription,
      poly,
      price,
      modelUrl,
      walkModelUrl, // NEW field
      software,
      softwareLogo,
      scale,
      rotation,
      technical
    } = req.body;

    // Find and update the asset
    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        extendedDescription,
        poly,
        price,
        modelUrl,
        walkModelUrl, // update walkModelUrl
        software,
        softwareLogo,
        scale,
        rotation,
        technical
      },
      { new: true, runValidators: true }
    );

    if (!updatedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({ message: "3D asset updated successfully", asset: updatedAsset });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE asset
router.delete('/assets/:id', async (req, res) => {
  try {
    const deletedAsset = await Asset.findByIdAndDelete(req.params.id);

    if (!deletedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({ message: "3D asset deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
