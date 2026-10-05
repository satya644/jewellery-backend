const express = require('express');
const router = express.Router();
const { uploadImages, uploadVideo } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const uploadVideoMiddleware = require('../middleware/uploadVideoMiddleware');

router.post('/', protect, upload.array('images', 5), uploadImages);
router.post('/video', protect, (req, res, next) => {
  uploadVideoMiddleware.single('video')(req, res, (err) => {
    if (err) {
      console.error('Video upload error:', err);
      return res.status(400).json({ success: false, message: err.message || 'Video upload failed' });
    }
    next();
  });
}, uploadVideo);

module.exports = router;
