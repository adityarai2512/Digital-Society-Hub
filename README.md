# 🏘️ Digital Society Hub

**One Platform for Smart Community Living.**

## 🚀 Setup (Recap)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# .env me apni MongoDB URI daalo
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Browser me kholo: **http://localhost:5173**

---

## ✅ Ab Tak Kya Bana Hai

1. **Authentication** — Register/Login/Logout, JWT security, role-based (Resident/Guard/Admin)
2. **Admin Approval System** — Naye users ko admin approve karta hai login se pehle
3. **Visitor Management** — QR code generate, guard verify/checkout
4. **Complaint Management** — Category-wise complaints, photo upload, status tracking, comments
5. **Maintenance Billing** — Single/bulk bill generate, resident "Pay Now" (simulated payment)
6. **Notice Board** — Admin post/delete kare, sab roles (Resident/Guard/Admin) dekh sakte hain; urgent notices upar pin hote hain
7. **Events Management** — Admin event create kare, Resident register/cancel kare, participant list, seat limit support
8. **Parking Management** — Resident vehicle register kare, Admin total slots set kare aur parking slot assign kare, Occupied/Empty summary
9. **Marketplace** — Society grocery store (vegetables/fruits/ration): Admin products add kare (photo, price, stock), Resident cards se shop kare, cart me add kare, checkout kare (delivery address + simulated payment), order status track kare (Placed → Confirmed → Out for Delivery → Delivered)

## 🚧 Aage Kya Banega

10. Lost & Found, Emergency, Directory
11. Admin Analytics Dashboard (charts & reports)
12. Unique features — Reputation Score, Society Timeline, Community Points

---

## 🎨 Design System
- **Colors:** Navy (#1B2A4A), Marigold Gold (#E8A33D), Sage Green (#6B8F71)
- **Fonts:** Sora (headings), Inter (body), JetBrains Mono (numbers)
