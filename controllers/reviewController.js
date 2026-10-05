const Review = require('../models/Review');
const Product = require('../models/Product');

exports.createReview = async (req, res) => {
  try {
    const { customerName, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const review = await Review.create({ product: product._id, customerName, rating, comment });

    const allReviews = await Review.find({ product: product._id });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    product.averageRating = Math.round(avg * 10) / 10;
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
