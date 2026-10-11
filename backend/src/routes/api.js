const express = require('express');
const router = express.Router();
const multer = require('multer');
const plantController = require('../controllers/plantController');
const authController = require('../controllers/authController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Multer in-memory storage setup (keeps upload in RAM buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Authentication Routes (Single Admin: RSWF / RSWFPASS)
router.post('/auth/login', authController.login);
router.get('/auth/verify', authController.verify);

// Public Routes (Anyone can view plants without login)
router.get('/plants', plantController.getAll);
router.get('/plants/:id', plantController.getById);

// Protected Admin Routes (Only RSWF admin can identify, add, edit, or delete plants)
router.post('/identify', requireAdmin, upload.single('image'), plantController.identify);
router.post('/plants', requireAdmin, plantController.create);
router.put('/plants/:id', requireAdmin, plantController.update);
router.post('/plants/:id/height', requireAdmin, plantController.addHeightLog);
router.delete('/plants/:id', requireAdmin, plantController.delete);

module.exports = router;
