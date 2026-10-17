import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePhoto } from "react-icons/hi2";

// ============================================
// ADMIN MARKETPLACE PAGE
// 2 tabs:
// 1. "Products" — Admin naye products add kare, stock/price edit kare, delete kare
// 2. "Orders" — Admin saare residents ke orders dekhe aur delivery status update kare
// ============================================

const statusOptions = ["placed", "confirmed", "out-for-delivery", "delivered", "cancelled"];

export default function AdminMarketplace() {
  const [tab, setTab] = useState("products");

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "products" ? "bg-hub-navy text-white" : "bg-white border border-hub-line text-hub-ink-soft"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "orders" ? "bg-hub-navy text-white" : "bg-white border border-hub-line text-hub-ink-soft"
          }`}
        >
          Orders
        </button>
      </div>

      {tab === "products" ? <ProductsTab /> : <OrdersTab />}
    </div>
  );
}

// ============================================
// PRODUCTS TAB — Admin add/edit/delete products
// ============================================
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", category: "Vegetables", price: "", unit: "kg", stock: "" });
  const [photo, setPhoto] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      toast.error("Products load nahi ho paaye.");
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // FormData use karte hain kyunki isme photo (file) bhi bhejni hai text fields ke saath
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => form.append(key, val));
      if (photo) form.append("image", photo);

      await api.post("/products", form, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Product add ho gaya!");
      setFormData({ name: "", category: "Vegetables", price: "", unit: "kg", stock: "" });
      setPhoto(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Kuch galat hua.");
    } finally {
      setLoading(false);
    }
  };

  // Quick stock update — table ke andar hi input se
  const handleStockChange = async (id, newStock) => {
    try {
      await api.patch(`/products/${id}`, { stock: newStock });
      fetchProducts();
    } catch (error) {
      toast.error("Stock update fail hua.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Kya tum ye product delete karna chahte ho?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product delete ho gaya.");
      fetchProducts();
    } catch (error) {
      toast.error("Delete nahi ho paaya.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-hub-navy">Store Products</h2>
          <p className="text-sm text-hub-ink-soft">Sabzi, fruits, ration — jo bhi society store me milega.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-hub-navy text-white text-sm font-semibold rounded-lg hover:bg-hub-navy-light transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-hub-line rounded-xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Product Name</label>
              <input
                type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Tomato"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Category</label>
              <select name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none">
                <option>Vegetables</option><option>Fruits</option><option>Groceries</option><option>Dairy</option><option>Other</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Price (₹)</label>
              <input
                type="number" name="price" required min="0" value={formData.price} onChange={handleChange} placeholder="40"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none">
                <option>kg</option><option>dozen</option><option>packet</option><option>litre</option><option>piece</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Stock</label>
              <input
                type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} placeholder="100"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-ink mb-1.5">Photo (optional)</label>
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-hub-line cursor-pointer hover:border-hub-navy transition-colors w-fit">
              <HiOutlinePhoto className="w-5 h-5 text-hub-ink-soft" />
              <span className="text-sm text-hub-ink-soft">{photo ? photo.name : "Choose image"}</span>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="hidden" />
            </label>
          </div>
          <button
            type="submit" disabled={loading}
            className="px-5 py-2.5 bg-hub-gold text-hub-navy font-semibold rounded-lg hover:bg-hub-gold-light transition-colors disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      )}

      {products.length === 0 ? (
        <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
          <p className="text-hub-ink-soft text-sm">Abhi tak koi product add nahi hua.</p>
        </div>
      ) : (
        <div className="bg-white border border-hub-line rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-hub-paper text-hub-ink-soft text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-left px-5 py-3 font-medium">Stock</th>
                <th className="text-left px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hub-line">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-5 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-hub-paper overflow-hidden shrink-0">
                      {p.image && <img src={`http://localhost:5000${p.image}`} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-medium text-hub-ink">{p.name}</span>
                  </td>
                  <td className="px-5 py-3 text-hub-ink-soft">{p.category}</td>
                  <td className="px-5 py-3 text-hub-ink-soft">₹{p.price}/{p.unit}</td>
                  <td className="px-5 py-3">
                    <input
                      type="number" defaultValue={p.stock} min="0"
                      onBlur={(e) => handleStockChange(p._id, e.target.value)}
                      className="w-20 px-2 py-1 rounded-lg border border-hub-line text-sm focus:border-hub-navy focus:outline-none"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 text-hub-ink-soft hover:text-hub-alert hover:bg-hub-alert/10 rounded-lg">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================
// ORDERS TAB — Admin saare orders dekhe, status update kare
// ============================================
function OrdersTab() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      toast.error("Orders load nahi ho paaye.");
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success("Status update ho gaya.");
      fetchOrders();
    } catch (error) {
      toast.error("Update fail hua.");
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
        <p className="text-hub-ink-soft text-sm">Abhi tak koi order nahi aaya.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o._id} className="bg-white border border-hub-line rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-hub-ink">
                {o.resident?.name} • Flat {o.flatNumber}
              </p>
              <p className="text-xs text-hub-ink-soft">
                {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • {o.deliveryAddress}
              </p>
            </div>
            <p className="font-display font-bold text-hub-navy">₹{o.totalAmount}</p>
          </div>

          <p className="text-xs text-hub-ink-soft mb-3">
            {o.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={o.status}
              onChange={(e) => handleStatusChange(o._id, e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-hub-line text-sm focus:border-hub-navy focus:outline-none"
            >
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              o.paymentStatus === "paid" ? "bg-hub-sage-light text-hub-sage" : "bg-hub-gold-light/40 text-hub-gold"
            }`}>
              {o.paymentStatus === "paid" ? "Paid" : "Payment Pending"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
