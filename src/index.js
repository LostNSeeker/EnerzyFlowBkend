import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import cors from "cors"; // Import cors

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors()); // Use cors middleware

const routersPath = path.join(__dirname, "routes");

// Using async IIFE to handle dynamic imports
(async () => {
  app.get("/", (req, res) => {
    res.json({ success: true, message: "API is running...." });
  });
  for (const file of fs.readdirSync(routersPath)) {
    if (file.endsWith(".routes.js")) {
      const fullPath = path.join(routersPath, file);
      const fileUrl = `file:///${fullPath.replace(/\\/g, "/")}`;
      const routerModule = await import(fileUrl);
      const router = routerModule.default; // Change to default since routes are exported as default
      const routePrefix = `/${path.basename(file, ".routes.js")}`;
      app.use(routePrefix, router);
    }
  }

  const PORT = Number(process.env.PORT) || 3000;
  connectDB();
  app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
  );
})();
