import { Hono } from "hono";
import type { Handler } from "hono/types";
// This import often contains dev-server heartbeats that hang Vercel
import updatedFetch from "../src/__create/fetch";

const API_BASENAME = "/api";
const api = new Hono();

/**
 * FIX 1: GATING THE FETCH WRAPPER
 * We only want to use the updatedFetch (heartbeat/dev tools) in development.
 * This prevents the Vercel build process from hanging.
 */
if (import.meta.env.DEV && globalThis.fetch) {
	globalThis.fetch = updatedFetch;
}

// 1. Vite Glob Import (Eagerly loaded at build time)
const routeModules = import.meta.glob("../src/app/api/**/route.js", {
	eager: true,
});

// 2. Path Helper
function getHonoPathFromVitePath(vitePath: string): string {
	let path = vitePath.replace("../src/app/api", "").replace("/route.js", "");

	if (path === "") return "/";

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

// 3. Synchronous Registration (Safe for Build)
function registerRoutes() {
	api.routes = [];
	const sortedPaths = Object.keys(routeModules).sort(
		(a, b) => b.length - a.length,
	);

	for (const fileKey of sortedPaths) {
		const route: any = routeModules[fileKey];
		const honoPath = getHonoPathFromVitePath(fileKey);
		const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

		for (const method of methods) {
			if (route && route[method]) {
				const m = method.toLowerCase();
				const handler: Handler = (c) => {
					return route[method](c.req.raw, { params: c.req.param() });
				};

				if (m === "get") api.get(honoPath, handler);
				else if (m === "post") api.post(honoPath, handler);
				else if (m === "put") api.put(honoPath, handler);
				else if (m === "delete") api.delete(honoPath, handler);
				else if (m === "patch") api.patch(honoPath, handler);
			}
		}
	}
}

registerRoutes();

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		registerRoutes();
	});
}

/**
 * FIX 2: FORCE CLEANUP
 * This ensures that if any invisible timers were started,
 * the build process is allowed to exit.
 */
if (!import.meta.env.DEV && typeof process !== "undefined") {
	console.log("API Route registration complete. Finalizing build...");
}

export { api, API_BASENAME };
