import Product from "../models/Product.js";

// ============================================
// PRODUCT CONTROLLER
// Admin/store manager yahan se products (sabzi, fruits, ration)
// add/edit/delete karta hai. Resident inhi products ko GET karke
// apni shopping page (ResidentMarketplace.jsx) me dekhta hai.
// ============================================

// @desc   Admin: naya product add kare (photo ke saath)
// @route  POST /api/products
// @access Sirf Admin
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, unit, stock } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      unit,
      stock: stock || 0,
      // Multer ne file ko upload karke req.file me detail di hai (agar photo bheji ho)
      image: req.file ? `/uploads/products/${req.file.filename}` : "",
      addedBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Sab logged-in users — saare available products dekhein (shop page)
// @route  GET /api/products
// @access Koi bhi logged-in user
export const getAllProducts = async (req, res) => {
  try {
    // Admin ke liye saare products (available + unavailable dono)
    // Resident/Guard ke liye sirf available products
    const filter = req.user.role === "admin" ? {} : { isAvailable: true };

    const products = await Product.find(filter).sort({ category: 1, name: 1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin: product update kare (price, stock, availability, ya naya photo)
// @route  PATCH /api/products/:id
// @access Sirf Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product nahi mila." });
    }

    // Sirf jo fields bheji gayi hain unhi ko update karo (baaki wahi rahengi)
    const { name, category, price, unit, stock, isAvailable } = req.body;
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (unit !== undefined) product.unit = unit;
    if (stock !== undefined) product.stock = stock;
    if (isAvailable !== undefined) product.isAvailable = isAvailable;

    // Agar nayi photo upload hui hai, to purani ki jagah update kar do
    if (req.file) {
      product.image = `/uploads/products/${req.file.filename}`;
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin: product delete kare
// @route  DELETE /api/products/:id
// @access Sirf Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product nahi mila." });
    }
    await product.deleteOne();
    res.status(200).json({ message: "Product delete ho gaya." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
