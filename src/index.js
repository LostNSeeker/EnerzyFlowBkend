import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routersPath = path.join(__dirname, "routes");

// Using async IIFE to handle dynamic imports
(async () => {
	for (const file of fs.readdirSync(routersPath)) {
		if (file.endsWith(".routes.js")) {
			const fullPath = path.join(routersPath, file);
			const fileUrl = `file:///${fullPath.replace(/\\/g, "/")}`;
			const routerModule = await import(fileUrl);
			const router = routerModule.default; // Change to default since routes are exported as default
			app.use(router);
		}
	}

	const PORT = Number(process.env.PORT) || 3000;
	connectDB();
	app.listen(PORT, () =>
		console.log(`Server is running on http://localhost:${PORT}`)
	);
})();
