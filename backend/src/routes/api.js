const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const plantController = require('../controllers/plantController');

// Multer storage setup for 480p compressed uploaded image files
const uploadsDir = path.join(__dirname, '../../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.webp';
    const uniqueName = 'plant_480p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit (compressed uploads are usually < 150KB)
});

// API Routes
router.post('/identify', upload.single('image'), plantController.identify);
router.get('/plants', plantController.getAll);
router.get('/plants/:id', plantController.getById);
router.post('/plants', plantController.create);
router.put('/plants/:id', plantController.update);
router.post('/plants/:id/height', plantController.addHeightLog);
router.delete('/plants/:id', plantController.delete);

module.exports = router;
