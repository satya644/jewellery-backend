const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
  },
  { _id: false }
);
const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, required: [true, 'Customer name is required'] },
    phone: { type: String, required: [true, 'Phone number is required'] },
    email: { type: String, lowercase: true, trim: true },
    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: { type: [orderItemSchema], required: true, validate: [(arr) => arr.length > 0, 'Order must contain at least one item'] },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    orderStatus: { type: String, enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Placed' },
    stampAwarded: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Order', orderSchema);
