const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

const STAMPS_NEEDED_PER_CARD = 7;

exports.createOrder = async (req, res) => {
  try {
    const { customerName, phone, email, address, items, paymentMethod, notes } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      totalAmount += price * item.quantity;
      orderItems.push({ product: product._id, name: product.name, price, quantity: item.quantity, image: product.images[0]?.url || '' });
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      customer: req.customer ? req.customer._id : undefined,
      customerName, phone, email, address, items: orderItems, totalAmount, paymentMethod: 'COD', notes,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    const orders = await Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Order.countDocuments(filter);
    res.json({ success: true, count: orders.length, total, page: Number(page), totalPages: Math.ceil(total / limit), data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update order status. Awards a loyalty stamp the FIRST time an order becomes "Delivered".
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const becomingDelivered = orderStatus === 'Delivered' && order.orderStatus !== 'Delivered';

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // Award a stamp once, only when the order newly becomes Delivered, and only if linked to a customer account
    if (becomingDelivered && !order.stampAwarded && order.customer) {
      const customer = await Customer.findById(order.customer);
      if (customer) {
        customer.stamps += 1;
        if (customer.stamps >= STAMPS_NEEDED_PER_CARD) {
          customer.stamps = 0;
          customer.completedCards += 1;
          customer.rewardsAvailable += 1;
        }
        await customer.save();
        order.stampAwarded = true;
      }
    }

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
