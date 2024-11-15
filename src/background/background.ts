/*
 * @Author: mulingyuer
 * @Date: 2024-11-15 10:09:16
 * @LastEditTime: 2024-11-15 10:17:04
 * @LastEditors: mulingyuer
 * @Description: background脚本
 * @FilePath: \chrome-extension-template\src\background\background.ts
 * 怎么可能会有bug！！！
 */

/** 插件安装 */
chrome.runtime.onInstalled.addListener(async () => {
	console.log("插件安装成功！");
});

/** 插件启用 */
chrome.runtime.onStartup.addListener(async () => {
	console.log("插件启用成功！");
});
