const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jewellery-videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'webm'],
    public_id: (req, file) => `video-${Date.now()}`,
  },
});
const uploadVideo = multer({ storage: videoStorage, limits: { fileSize: 1000 * 1024 * 1024 } });
module.exports = uploadVideo;
