import express from "express";
import path from "path";
import fs from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routersPath = path.join(__dirname, "routes");
fs.readdirSync(routersPath).forEach((file) => {
	if (file.endsWith(".routes.js")) {
		const routerModule = require(path.join(routersPath, file));
		const router = routerModule.router;
		app.use(router);
	}
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () =>
	console.log(`Server is running on http://localhost:${PORT}`)
) > index.js;
