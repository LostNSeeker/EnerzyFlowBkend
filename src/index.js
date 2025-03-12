import * as dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";

// Initialize environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json()); // Add body parsing middleware
app.use(cors());

// Routes
app.get("/",(req,res)=>{
	res.send("Welcome to EnerzyFlow Backend");
})
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/payment", paymentRoutes);

// app.use("/dummyUsers",async (req, res )=>{
// 	await seedUsers(10)
// 	res.send("Dummy users Added")
// });
// app.use("/dummyProducts",async (req, res )=>{
// 	await seedDatabase(10)
// 	res.send("Dummy Products Added")
// });
// app.use("/dummyOrders",async (req, res )=>{
// 	await seedOrders(10)
// 	res.send("Dummy orders Added")
// });
// app.use("/createDummySettings",async (req, res )=>{
// 	await createDummySettings("60d21b4667d0d8992e610c85")
// 	res.send("Dummy settings created")
// });
// app.use("/seedFaq",async (req, res )=>{
// 	await seedFaq()
// 	res.send("seedFaq created")
// });

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

startServer();