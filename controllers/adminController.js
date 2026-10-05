const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ success: false, message: 'Admin already exists with this email' });
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({ success: true, data: { _id: admin._id, name: admin.name, email: admin.email, token: generateToken(admin._id) } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    res.json({ success: true, data: { _id: admin._id, name: admin.name, email: admin.email, token: generateToken(admin._id) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminProfile = async (req, res) => {
  res.json({ success: true, data: req.admin });
};

// @desc    Update logged-in admin's own email/password (requires current password to confirm)
// @route   PUT /api/admin/profile
// @access  Private (admin)
exports.updateAdminProfile = async (req, res) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    if (newEmail) {
      const existing = await Admin.findOne({ email: newEmail, _id: { $ne: admin._id } });
      if (existing) return res.status(400).json({ success: false, message: 'This email is already in use' });
      admin.email = newEmail;
    }
    if (newPassword) admin.password = newPassword; // will be re-hashed by the pre-save hook

    await admin.save();

    res.json({
      success: true,
      data: { _id: admin._id, name: admin.name, email: admin.email, token: generateToken(admin._id) },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
