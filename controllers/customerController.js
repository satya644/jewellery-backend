const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const generateToken = (id) => jwt.sign({ id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '90d' });

exports.registerCustomer = async (req, res) => {
  try {
    const { name, phone, email, password, address } = req.body;
    const existing = await Customer.findOne({ phone });
    if (existing) return res.status(400).json({ success: false, message: 'An account with this phone number already exists' });
    const customer = await Customer.create({ name, phone, email, password, address });
    res.status(201).json({
      success: true,
      data: {
        _id: customer._id, name: customer.name, phone: customer.phone, email: customer.email, address: customer.address,
        stamps: customer.stamps, completedCards: customer.completedCards, rewardsAvailable: customer.rewardsAvailable,
        token: generateToken(customer._id),
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const customer = await Customer.findOne({ phone });
    if (!customer) return res.status(401).json({ success: false, message: 'Invalid phone number or password' });
    const isMatch = await customer.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid phone number or password' });
    res.json({
      success: true,
      data: {
        _id: customer._id, name: customer.name, phone: customer.phone, email: customer.email, address: customer.address,
        stamps: customer.stamps, completedCards: customer.completedCards, rewardsAvailable: customer.rewardsAvailable,
        token: generateToken(customer._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomerProfile = async (req, res) => {
  res.json({ success: true, data: req.customer });
};

exports.updateCustomerProfile = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const customer = await Customer.findById(req.customer._id);
    if (name !== undefined) customer.name = name;
    if (email !== undefined) customer.email = email;
    if (address !== undefined) customer.address = address;
    await customer.save();
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
