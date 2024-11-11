/*
 * @Author: mulingyuer
 * @Date: 2024-11-11 11:58:04
 * @LastEditTime: 2024-11-11 15:37:57
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
		content_scripts: [
			{
				js: ["src/content/main.ts"],
				matches: ["https://www.google.com/*"]
			}
		]
	};
});
