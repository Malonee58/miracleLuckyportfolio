import { Hono } from "hono";
import type { Handler } from "hono/types";
import updatedFetch from "../src/__create/fetch";

const API_BASENAME = "/api";
const api = new Hono();

if (globalThis.fetch) {
	globalThis.fetch = updatedFetch;
}

/**
 * 1. Use Vite's glob import to find all route.js files at BUILD TIME.
 * This ensures the routes are included in the Vercel deployment.
 */
const routeModules = import.meta.glob("../src/app/api/**/route.js", {
	eager: true,
});

/**
 * 2. Helper to transform the Vite file path into a Hono route pattern.
 * Example: '../src/app/api/user/[id]/route.js' -> '/user/:id'
 */
function getHonoPathFromVitePath(vitePath: string): string {
	// Remove the prefix and the filename
	let path = vitePath.replace("../src/app/api", "").replace("/route.js", "");

	if (path === "") return "/";

	// Handle Dynamic Routes: [id] -> :id
	// Handle Catch-all: [...path] -> :path{.*}
	return path
		.split("/")
		.map((segment) => {
			const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
			if (match) {
				const [_, dots, param] = match;
				return dots === "..." ? `:${param}{.+}` : `:${param}`;
			}
			return segment;
		})
		.join("/");
}

// 3. Register the routes
async function registerRoutes() {
	// Clear existing routes (useful for HMR)
	api.routes = [];

	// Sort paths so deeper routes or root routes don't shadow others
	const sortedPaths = Object.keys(routeModules).sort(
		(a, b) => b.length - a.length,
	);

	for (const fileKey of sortedPaths) {
		const route: any = routeModules[fileKey];
		const honoPath = getHonoPathFromVitePath(fileKey);

		const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

		for (const method of methods) {
			if (route[method]) {
				const handler: Handler = async (c) => {
					const params = c.req.param();
					// In production, we use the already-imported 'route' module
					return await route[method](c.req.raw, { params });
				};

				const m = method.toLowerCase();
				if (m === "get") api.get(honoPath, handler);
				else if (m === "post") api.post(honoPath, handler);
				else if (m === "put") api.put(honoPath, handler);
				else if (m === "delete") api.delete(honoPath, handler);
				else if (m === "patch") api.patch(honoPath, handler);
			}
		}
	}
}

// Initial registration
await registerRoutes();

// Support Hot Module Replacement (HMR) for local development
if (import.meta.hot) {
	import.meta.hot.accept(() => {
		registerRoutes().catch(console.error);
	});
}

export { api, API_BASENAME };
