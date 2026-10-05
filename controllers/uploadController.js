exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No images uploaded' });
    const uploadedImages = req.files.map((file) => ({ url: file.path, publicId: file.filename }));
    res.status(201).json({ success: true, count: uploadedImages.length, data: uploadedImages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No video uploaded' });
    res.status(201).json({ success: true, data: { url: req.file.path, publicId: req.file.filename } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
