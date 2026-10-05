const express = require('express');
const router = express.Router();
const { registerCustomer, loginCustomer, getCustomerProfile, updateCustomerProfile, getAllCustomers } = require('../controllers/customerController');
const { protectCustomer } = require('../middleware/customerAuthMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.get('/profile', protectCustomer, getCustomerProfile);
router.put('/profile', protectCustomer, updateCustomerProfile);
router.get('/', protect, getAllCustomers);

module.exports = router;
