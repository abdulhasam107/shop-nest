import Order from '../models/Order.js';
import sendEmail from '../utils/sendEmail.js';

// =========================
// CREATE ORDER
// =========================
export const createOrder = async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    const { items, address } = req.body;

    // ✅ VALIDATION (VERY IMPORTANT)
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items must be a non-empty array" });
    }

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // ✅ SAFE TOTAL CALCULATION
    const totalPrice = items.reduce((acc, item) => {
      return acc + (item.price || 0) * (item.quantity || 0);
    }, 0);

    const newOrder = new Order({
      user: req.user._id,
      items,
      address,
      totalPrice,
      paymentId: "COD_" + Date.now(),
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });

  } catch (error) {
    console.log("ORDER ERROR:", error);

    return res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

// =========================
// GET USER ORDERS
// =========================
export const getOrdersById = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.productid', 'name price');

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// =========================
// ADMIN: GET ALL ORDERS
// =========================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.productid', 'name price');

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// =========================
// UPDATE STATUS
// =========================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating order',
      error: error.message,
    });
  }
};