/*
 * @Author: mulingyuer
 * @Date: 2024-11-11 11:58:04
 * @LastEditTime: 2024-11-15 17:00:30
 * @LastEditors: mulingyuer
 * @Description: manifest 配置文件
 * @FilePath: \chrome-extension-template\manifest.config.ts
 * 怎么可能会有bug！！！
 */
import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";

export default defineManifest(async (env) => {
	return {
		manifest_version: 3,
		name: env.mode === "production" ? packageJson.name : `[dev] ${packageJson.name}`,
		description: packageJson.description,
		version: packageJson.version,
		icons: {
			"16": "icons/icon-16.png",
			"32": "icons/icon-32.png",
			"48": "icons/icon-48.png",
			"128": "icons/icon-128.png"
		},
		permissions: ["sidePanel", "tabs"],
		content_scripts: [
			{
				js: ["src/pages/content/main.ts"],
				matches: ["https://www.google.com/*"]
			}
		],
		background: {
			service_worker: "src/background/background.ts",
			type: "module"
		},
		action: {
			default_popup: "src/pages/popup/index.html"
		},
		side_panel: {
			default_path: "src/pages/side-panel/index.html"
		},
		web_accessible_resources: [
			{
				resources: ["src/pages/404/index.html"],
				matches: ["<all_urls>"]
			}
		]
	};
});
