const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: { type: String, required: [true, 'Product description is required'] },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    discountPrice: { type: Number, default: 0 },
    category: { type: String, required: [true, 'Category is required'], enum: ['Necklace', 'Earrings', 'Ring', 'Bracelet', 'Anklet', 'Set', 'Other'] },
    material: { type: String, default: 'Other' },
    images: [{ url: { type: String, required: true }, publicId: { type: String } }],
    video: { url: { type: String, default: '' }, publicId: { type: String, default: '' } },
    stock: { type: Number, required: true, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Product', productSchema);
