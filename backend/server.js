import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import parkingRoutes from "./routes/parkingRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Uploaded photos (complaint images) ko publicly serve karo
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("🏘️ Digital Society Hub API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
// Aage jab modules banayenge to yahan add karenge:
// app.use("/api/lostfound", lostFoundRoutes);
// etc.

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true },
});

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
