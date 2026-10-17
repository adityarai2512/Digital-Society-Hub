import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  HiOutlineShoppingCart, HiOutlinePlus, HiOutlineMinus, HiOutlineMapPin,
  HiOutlineTruck, HiOutlineCreditCard, HiOutlineCheckCircle, HiOutlineClock,
} from "react-icons/hi2";

// ============================================
// RESIDENT MARKETPLACE PAGE
// Ye page 2 tabs me bata hua hai:
// 1. "Shop" — products browse karo, cart me add karo, checkout karo
// 2. "My Orders" — pehle ke orders ka status track karo
//
// CART DESIGN NOTE: Cart sirf isi component ke "state" me rehta hai
// (useState), koi alag Context nahi banaya — kyunki cart sirf isi
// ek page ke andar use hota hai. Page refresh hote hi cart khali ho
// jayega (jaisa bahut si simple shopping apps me hota hai).
// ============================================

const categoryTabs = ["All", "Vegetables", "Fruits", "Groceries", "Dairy", "Other"];

const orderStatusSteps = ["placed", "confirmed", "out-for-delivery", "delivered"];
const statusLabels = {
  placed: "Order Placed",
  confirmed: "Confirmed",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function ResidentMarketplace() {
  const [tab, setTab] = useState("shop"); // "shop" ya "orders"

  return (
    <div className="space-y-6">
      {/* ===== TAB SWITCHER ===== */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("shop")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "shop" ? "bg-hub-navy text-white" : "bg-white border border-hub-line text-hub-ink-soft"
          }`}
        >
          Shop
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "orders" ? "bg-hub-navy text-white" : "bg-white border border-hub-line text-hub-ink-soft"
          }`}
        >
          My Orders
        </button>
      </div>

      {tab === "shop" ? <ShopTab /> : <OrdersTab />}
    </div>
  );
}

// ============================================
// SHOP TAB — Products grid + Cart
// ============================================
function ShopTab() {
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [showCart, setShowCart] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      toast.error("Products load nahi ho paaye.");
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Cart me quantity badhao (product card ke "+" button se)
  const addToCart = (productId) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  // Cart me quantity ghatao — 0 tak pahunchne par item cart se hat jaata hai
  const removeFromCart = (productId) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[productId] <= 1) {
        delete updated[productId];
      } else {
        updated[productId] -= 1;
      }
      return updated;
    });
  };

  // Cart object se ek proper array banate hain (checkout aur display ke liye)
  const cartItems = Object.entries(cart)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p._id === productId);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean); // agar product delete ho chuka ho to skip karo

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  // "Place Order" — checkout ka final step
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setPlacingOrder(true);
    try {
      await api.post("/orders", {
        items: cartItems.map((item) => ({ productId: item._id, quantity: item.quantity })),
        deliveryAddress: deliveryAddress.trim() || undefined, // khali ho to backend default (flat number) use karega
      });
      toast.success("Order place ho gaya! 🎉 Payment 'My Orders' tab me karo.");
      setCart({});
      setDeliveryAddress("");
      setShowCart(false);
      fetchProducts(); // Stock update dikhane ke liye refresh
    } catch (error) {
      toast.error(error.response?.data?.message || "Order place nahi ho paaya.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const filteredProducts = categoryFilter === "All" ? products : products.filter((p) => p.category === categoryFilter);

  return (
    <div className="space-y-4">
      {/* ===== CATEGORY FILTER TABS ===== */}
      <div className="flex gap-2 flex-wrap">
        {categoryTabs.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              categoryFilter === c ? "bg-hub-gold text-hub-navy" : "bg-white border border-hub-line text-hub-ink-soft"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ===== PRODUCT GRID — jaisa online shopping cards hote hain ===== */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
          <p className="text-hub-ink-soft text-sm">Is category me abhi koi product nahi hai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div key={p._id} className="bg-white border border-hub-line rounded-xl overflow-hidden">
              {/* Product image — agar upload nahi hui to placeholder box dikhao */}
              <div className="aspect-square bg-hub-paper flex items-center justify-center">
                {p.image ? (
                  <img src={`http://localhost:5000${p.image}`} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-hub-ink-soft text-xs">No photo</span>
                )}
              </div>
              <div className="p-3">
                <p className="font-medium text-hub-ink text-sm truncate">{p.name}</p>
                <p className="text-xs text-hub-ink-soft mb-2">₹{p.price} / {p.unit}</p>

                {p.stock === 0 ? (
                  <p className="text-xs font-medium text-hub-alert">Out of Stock</p>
                ) : cart[p._id] ? (
                  // Agar cart me already hai to "-" [quantity] "+" wala stepper dikhao
                  <div className="flex items-center justify-between bg-hub-navy rounded-lg">
                    <button onClick={() => removeFromCart(p._id)} className="p-1.5 text-white">
                      <HiOutlineMinus className="w-4 h-4" />
                    </button>
                    <span className="text-white text-sm font-semibold">{cart[p._id]}</span>
                    <button onClick={() => addToCart(p._id)} className="p-1.5 text-white">
                      <HiOutlinePlus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  // Warna simple "Add" button dikhao
                  <button
                    onClick={() => addToCart(p._id)}
                    className="w-full py-1.5 bg-hub-gold-light/40 text-hub-gold text-xs font-semibold rounded-lg hover:bg-hub-gold hover:text-hub-navy transition-colors"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== FLOATING CART BUTTON — jab cart me kuch ho tabhi dikhega ===== */}
      {cartCount > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-hub-navy text-white rounded-full shadow-lg hover:bg-hub-navy-light transition-colors z-40"
        >
          <HiOutlineShoppingCart className="w-5 h-5" />
          <span className="font-semibold">{cartCount} items • ₹{cartTotal}</span>
        </button>
      )}

      {/* ===== CART / CHECKOUT MODAL ===== */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto">
            <h3 className="font-display font-bold text-hub-navy text-lg mb-4">Your Cart</h3>

            {cartItems.length === 0 ? (
              <p className="text-sm text-hub-ink-soft text-center py-6">Cart khali hai.</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-hub-ink">{item.name}</p>
                        <p className="text-xs text-hub-ink-soft">₹{item.price} × {item.quantity} {item.unit}</p>
                      </div>
                      <p className="font-mono font-semibold text-hub-navy">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-hub-line pt-3 mb-4 flex items-center justify-between">
                  <span className="font-semibold text-hub-ink">Total</span>
                  <span className="font-display font-bold text-lg text-hub-navy">₹{cartTotal}</span>
                </div>

                {/* Delivery address */}
                <div className="mb-4">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-hub-ink mb-1.5">
                    <HiOutlineMapPin className="w-4 h-4" /> Delivery Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Default: apna flat number"
                    className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none text-sm"
                  />
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-hub-gold text-hub-navy font-semibold rounded-lg hover:bg-hub-gold-light transition-colors disabled:opacity-60"
                >
                  <HiOutlineTruck className="w-5 h-5" />
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </>
            )}

            <button onClick={() => setShowCart(false)} className="w-full mt-2 py-2 text-sm text-hub-ink-soft">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// ORDERS TAB — pehle ke orders + payment + status tracking
// ============================================
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [payingId, setPayingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/mine");
      setOrders(data);
    } catch (error) {
      toast.error("Orders load nahi ho paaye.");
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handlePay = async (id) => {
    setPayingId(id);
    try {
      const { data } = await api.patch(`/orders/${id}/pay`);
      toast.success(data.message);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment fail hua.");
    } finally {
      setPayingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
        <p className="text-hub-ink-soft text-sm">Abhi tak koi order nahi kiya.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o._id} className="bg-white border border-hub-line rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-hub-ink">Order #{o._id.slice(-6).toUpperCase()}</p>
              <p className="text-xs text-hub-ink-soft">
                {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} •{" "}
                {o.deliveryAddress}
              </p>
            </div>
            <p className="font-display font-bold text-hub-navy">₹{o.totalAmount}</p>
          </div>

          {/* Order items ki chhoti summary */}
          <p className="text-xs text-hub-ink-soft mb-3">
            {o.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
          </p>

          {/* ===== STATUS TRACKER — 4 steps visually dikhate hain ===== */}
          {o.status !== "cancelled" ? (
            <div className="flex items-center mb-4">
              {orderStatusSteps.map((step, i) => {
                const currentIndex = orderStatusSteps.indexOf(o.status);
                const isDone = i <= currentIndex;
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isDone ? "bg-hub-sage text-white" : "bg-hub-line text-hub-ink-soft"}`}>
                        {isDone ? <HiOutlineCheckCircle className="w-4 h-4" /> : <HiOutlineClock className="w-3 h-3" />}
                      </div>
                      <p className={`text-[10px] mt-1 text-center ${isDone ? "text-hub-sage font-medium" : "text-hub-ink-soft"}`}>
                        {statusLabels[step]}
                      </p>
                    </div>
                    {i < orderStatusSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex ? "bg-hub-sage" : "bg-hub-line"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm font-medium text-hub-alert mb-4">Ye order cancel ho chuka hai.</p>
          )}

          {/* Payment status/button */}
          {o.paymentStatus === "paid" ? (
            <span className="flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full text-xs font-medium bg-hub-sage-light text-hub-sage">
              <HiOutlineCheckCircle className="w-4 h-4" /> Paid
            </span>
          ) : (
            <button
              onClick={() => handlePay(o._id)}
              disabled={payingId === o._id}
              className="flex items-center gap-2 px-4 py-2 bg-hub-gold text-hub-navy text-sm font-semibold rounded-lg hover:bg-hub-gold-light transition-colors disabled:opacity-60"
            >
              <HiOutlineCreditCard className="w-4 h-4" />
              {payingId === o._id ? "Processing..." : "Pay Now"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
