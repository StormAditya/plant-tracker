const express = require('express');
const router = express.Router();
const multer = require('multer');
const plantController = require('../controllers/plantController');

// Multer in-memory storage setup (keeps upload in RAM buffer, preventing disk clutter in uploads/ folder)
const storage = multer.memoryStorage();

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
