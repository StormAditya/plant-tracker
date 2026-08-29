const path = require('path');
const storageService = require('../services/storageService');
const { identifyPlantSpecies } = require('../services/aiVisionService');
const { uploadToCloudinary } = require('../services/cloudinaryStorage');

const plantController = {
  // Step 1: Upload plant photo & get automatic AI species identification
  async identify(req, res) {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: 'No image file buffer uploaded' });
      }

      const imageBuffer = req.file.buffer;
      const mimeType = req.file.mimetype || 'image/jpeg';
      const originalFilename = req.file.originalname || 'plant_upload.webp';

      // Identify plant species using Gemini AI Vision
      const identificationResult = await identifyPlantSpecies(imageBuffer, mimeType, originalFilename);

      // Upload directly from RAM memory buffer to Cloudinary Free Storage CDN
      let imageUrl = '';
      const isCloudinaryEnabled = process.env.STORAGE_PROVIDER === 'cloudinary' || Boolean(process.env.CLOUDINARY_CLOUD_NAME);

      if (isCloudinaryEnabled) {
        try {
          console.log('☁️ Streaming 480p photo buffer directly to Cloudinary Free CDN (zero local disk saving)...');
          const cloudResult = await uploadToCloudinary(imageBuffer, originalFilename);
          imageUrl = cloudResult.url;
          console.log(`✅ Cloudinary CDN URL: ${imageUrl}`);
        } catch (cloudErr) {
          console.error('⚠️ Cloudinary upload error:', cloudErr.message);
        }
      }

      // Fallback local storage only if Cloudinary is unavailable
      if (!imageUrl) {
        const fs = require('fs');
        const uploadsDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        const filename = 'img_480p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7) + '.webp';
        const targetPath = path.join(uploadsDir, filename);
        fs.writeFileSync(targetPath, imageBuffer);
        imageUrl = `/uploads/${filename}`;
        console.log(`💾 Saved fallback image to local uploads: ${imageUrl}`);
      }

      return res.json({
        success: true,
        imageUrl: imageUrl,
        identification: identificationResult,
        compressionInfo: {
          targetResolution: '480p',
          storageProvider: isCloudinaryEnabled && imageUrl.includes('cloudinary') ? 'Cloudinary 25GB Free CDN' : 'Local Storage',
          note: 'Image streamed in-memory to Cloudinary CDN.'
        }
      });
    } catch (err) {
      console.error('Error during plant identification:', err);
      return res.status(500).json({ error: 'Failed to process plant identification', details: err.message });
    }
  },

  // Get all saved plants
  async getAll(req, res) {
    try {
      const plants = await storageService.getAllPlants();
      return res.json({ success: true, count: plants.length, plants });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch plants', details: err.message });
    }
  },

  // Get single plant details by ID
  async getById(req, res) {
    try {
      const plant = await storageService.getPlantById(req.params.id);
      if (!plant) {
        return res.status(404).json({ error: 'Plant not found' });
      }
      return res.json({ success: true, plant });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch plant details', details: err.message });
    }
  },

  // Save new plant after user confirmation & edit step
  async create(req, res) {
    try {
      const {
        speciesName,
        scientificName,
        isSpeciesConfirmed,
        engineUsed,
        height,
        currentHeight,
        heightUnit,
        unit,
        imageUrl,
        notes,
        careTips,
        loggedAt
      } = req.body;

      if (!speciesName) {
        return res.status(400).json({ error: 'Species name is required' });
      }

      const initialHeight = height !== undefined ? height : currentHeight;
      const initialUnit = heightUnit || unit || 'cm';

      const newPlant = await storageService.savePlant({
        speciesName,
        scientificName,
        isSpeciesConfirmed: isSpeciesConfirmed !== undefined ? Boolean(isSpeciesConfirmed) : true,
        engineUsed,
        height: initialHeight || 0,
        heightUnit: initialUnit,
        imageUrl,
        notes: notes || '',
        careTips: careTips || '',
        loggedAt
      });

      return res.status(201).json({
        success: true,
        message: 'Plant profile created successfully',
        plant: newPlant
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create plant record', details: err.message });
    }
  },

  // Edit existing plant species/details (supports updating height and unit directly)
  async update(req, res) {
    try {
      const updated = await storageService.updatePlant(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Plant not found' });
      }
      return res.json({ success: true, plant: updated });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update plant', details: err.message });
    }
  },

  // Add new height log measurement for growth tracking
  async addHeightLog(req, res) {
    try {
      const { height, heightUnit, unit, note, loggedAt } = req.body;
      const finalHeight = parseFloat(height);

      if (isNaN(finalHeight)) {
        return res.status(400).json({ error: 'Valid height measurement number is required' });
      }

      const finalUnit = heightUnit || unit || 'cm';
      const updatedPlant = await storageService.addHeightLog(req.params.id, finalHeight, finalUnit, note, loggedAt);
      if (!updatedPlant) {
        return res.status(404).json({ error: 'Plant not found' });
      }

      return res.json({
        success: true,
        message: 'Height log added successfully',
        plant: updatedPlant
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to add height log', details: err.message });
    }
  },

  // Delete plant profile
  async delete(req, res) {
    try {
      const success = await storageService.deletePlant(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Plant not found' });
      }
      return res.json({ success: true, message: 'Plant deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete plant', details: err.message });
    }
  }
};

module.exports = {
  ...plantController
};
