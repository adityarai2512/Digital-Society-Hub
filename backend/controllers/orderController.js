import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ============================================
// ORDER CONTROLLER
// Resident cart checkout karke order place karta hai.
// Ye controller order create karta hai, list dikhata hai,
// payment simulate karta hai, aur Admin ko status update karne deta hai.
// ============================================

// @desc   Resident: cart checkout karke naya order place kare
// @route  POST /api/orders
// @access Sirf Resident
export const placeOrder = async (req, res) => {
  try {
    // Frontend se aata hai: [{ productId, quantity }, ...] aur deliveryAddress
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart khali hai." });
    }

    // SECURITY: Hum kabhi bhi frontend se aaya hua price trust nahi karte.
    // Har product ka CURRENT price database se dobara nikaalte hain,
    // taaki koi resident browser se price tamper karke sasta order na kar sake.
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product || !product.isAvailable) {
        return res.status(400).json({ message: `${item.name || "Ek product"} available nahi hai.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} ka stock kam hai (sirf ${product.stock} ${product.unit} bacha hai).` });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price, // Order ke time ka price snapshot
        unit: product.unit,
        quantity: item.quantity,
      });

      // Stock kam kar do (jitna order hua utna ghata do)
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      resident: req.user._id,
      flatNumber: req.user.flatNumber,
      items: orderItems,
      totalAmount,
      deliveryAddress: deliveryAddress || `Flat ${req.user.flatNumber}`,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Resident: apne saare orders dekhe
// @route  GET /api/orders/mine
// @access Sirf Resident
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ resident: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Resident: order ka payment kare (SIMULATED — Billing module jaisa hi pattern)
// @route  PATCH /api/orders/:id/pay
// @access Sirf Resident (aur sirf apna hi order)
export const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order nahi mila." });
    }
    if (order.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Ye tumhara order nahi hai." });
    }
    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Ye order pehle se hi paid hai." });
    }

    order.paymentStatus = "paid";
    order.paidOn = new Date();
    await order.save();

    res.status(200).json({ message: "✅ Payment successful! Order confirm ho gaya.", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin: saare society ke orders dekhe
// @route  GET /api/orders
// @access Sirf Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("resident", "name flatNumber phone")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin: order ka delivery status update kare
// @route  PATCH /api/orders/:id/status
// @access Sirf Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order nahi mila." });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status update ho gaya.", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
