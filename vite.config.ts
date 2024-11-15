import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { crx } from "@crxjs/vite-plugin";
import defineManifest from "./manifest.config";

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), crx({ manifest: defineManifest })],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@popup": fileURLToPath(new URL("./src/pages/popup", import.meta.url)),
			"@side-panel": fileURLToPath(new URL("./src/pages/side-panel/index.html", import.meta.url))
		}
	},
	// HACK: https://github.com/crxjs/chrome-extension-tools/issues/696
	server: {
		port: 5173,
		strictPort: true,
		hmr: {
			port: 5173
		}
	},
	build: {
		rollupOptions: {
			input: {
				popup: "src/pages/popup/index.html",
				"side-panel": "src/pages/side-panel/index.html",
				404: "src/pages/404/index.html"
			}
		}
	}
});
