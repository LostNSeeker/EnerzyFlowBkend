import * as dotenv from "dotenv";
import express from "express";
import connectDB from "./config/database.js";
import cors from "cors";
// Import routes
import testRoutes from "./routes/test.routes.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import rateLimit from "express-rate-limit";

// Basic rate limiter for all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
  // Optional: skip rate limiting for trusted IPs
  // skip: (req, res) => whitelist.includes(req.ip)
});
// Basic CORS setup - allows all origins
const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true, // Allow cookies to be sent with requests
  maxAge: 86400, // Cache preflight request results for 24 hours (in seconds)
};

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Add body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(limiter);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to EnerzyFlow Backend");
});
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// app.use("/test", testRoutes);

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/payment", paymentRoutes);

const PORT = Number(process.env.PORT) || 3000;

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer().then();
