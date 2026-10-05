const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
exports.protectCustomer = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'customer') return res.status(401).json({ success: false, message: 'Not authorized' });
      req.customer = await Customer.findById(decoded.id).select('-password');
      if (!req.customer) return res.status(401).json({ success: false, message: 'Customer not found' });
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};
