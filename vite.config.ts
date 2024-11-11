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
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	}
});
