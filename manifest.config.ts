/*
 * @Author: mulingyuer
 * @Date: 2024-11-11 11:58:04
 * @LastEditTime: 2024-11-26 09:15:30
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
		name: env.mode === "production" ? "Chrome代理扩展" : `[dev] Chrome代理扩展`,
		description: "一个强大的Chrome代理管理扩展",
		version: packageJson.version,
		minimum_chrome_version: "116",
		icons: {
			"16": "images/icons/icon-16.png",
			"32": "images/icons/icon-32.png",
			"48": "images/icons/icon-48.png",
			"128": "images/icons/icon-128.png"
		},
		permissions: [
			"proxy",
			"storage",
			"tabs"
		],
		host_permissions: [
			"<all_urls>"
		],
		action: {
			default_popup: "src/pages/popup/index.html"
		},
		background: {
			service_worker: "src/background/background.ts",
			type: "module"
		}
	};
});
