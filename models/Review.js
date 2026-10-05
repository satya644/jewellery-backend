const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    customerName: { type: String, required: [true, 'Name is required'] },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: [true, 'Review comment is required'] },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Review', reviewSchema);
