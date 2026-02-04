import path from "node:path";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";

import { addRenderIds } from "./plugins/addRenderIds";
import { aliases } from "./plugins/aliases";
import consoleToParent from "./plugins/console-to-parent";
import { layoutWrapperPlugin } from "./plugins/layouts";
import { loadFontsFromTailwindSource } from "./plugins/loadFontsFromTailwindSource";
import { nextPublicProcessEnv } from "./plugins/nextPublicProcessEnv";
import { restart } from "./plugins/restart";
import { restartEnvFileChange } from "./plugins/restartEnvFileChange";

export default defineConfig({
	// Expose NEXT_PUBLIC_* env vars
	envPrefix: "NEXT_PUBLIC_",

	// ✅ Vercel + Node 20
	build: {
		target: "node20",
		ssr: true,
	},

	esbuild: {
		target: "node20",
	},

	optimizeDeps: {
		include: ["fast-glob", "lucide-react"],
		exclude: [
			"@hono/auth-js/react",
			"@hono/auth-js",
			"@auth/core",
			"hono/context-storage",
			"@auth/core/errors",
			"fsevents",
			"lightningcss",
		],
	},

	// ✅ REQUIRED for SSR + styled-jsx
	ssr: {
		noExternal: [
			"@react-router/dev",
			"react-router-hono-server",
			"styled-jsx",
			"lucide-react",
		],
	},

	logLevel: "info",

	plugins: [
		nextPublicProcessEnv(),
		restartEnvFileChange(),

		// 🔑 CRITICAL FIX — tell RR where src/app is
		reactRouterHonoServer({
			serverEntryPoint: "./__create/index.ts",
			runtime: "node",
			appDirectory: "src/app",
		}),

		babel({
			include: ["src/**/*.{js,jsx,ts,tsx}"],
			exclude: /node_modules/,
			babelConfig: {
				babelrc: false,
				configFile: false,
				plugins: ["styled-jsx/babel"],
			},
		}),

		restart({
			restart: [
				"src/**/page.jsx",
				"src/**/page.tsx",
				"src/**/layout.jsx",
				"src/**/layout.tsx",
				"src/**/route.js",
				"src/**/route.ts",
			],
		}),

		consoleToParent(),
		loadFontsFromTailwindSource(),
		addRenderIds(),
		tsconfigPaths(),
		aliases(),
		layoutWrapperPlugin(),

		// ⚠️ MUST BE LAST
	reactRouter({
	appDirectory: "src/app",
}),

	],

	resolve: {
		alias: {
			lodash: "lodash-es",
			"npm:stripe": "stripe",
			stripe: path.resolve(__dirname, "./src/__create/stripe"),
			"@auth/create/react": "@hono/auth-js/react",
			"@auth/create": path.resolve(__dirname, "./src/__create/@auth/create"),
			"@": path.resolve(__dirname, "src"),
		},
		dedupe: ["react", "react-dom"],
	},

	clearScreen: false,

	server: {
		host: "0.0.0.0",
		port: 4000,
		hmr: {
			overlay: false,
		},
	},
});
