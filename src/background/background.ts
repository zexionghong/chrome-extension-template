/*
 * @Author: mulingyuer
 * @Date: 2024-11-15 10:09:16
 * @LastEditTime: 2024-11-15 17:46:53
 * @LastEditors: mulingyuer
 * @Description: background脚本
 * @FilePath: \chrome-extension-template\src\background\background.ts
 * 怎么可能会有bug！！！
 */
import { MenuId, chromeContextMenu } from "@/utils/chrome-context-menus";
import { ChromeNotifications } from "@/utils/chrome-notifications";

/** 添加示例右键菜单 */
function addContextMenu() {
	chromeContextMenu.create({
		menuProperties: {
			id: MenuId.EXAMPLE_MENU,
			title: "谷歌浏览器扩展模板菜单",
			contexts: ["all"]
		},
		onClicked: (info, tab) => {
			console.log("右键菜单点击事件", info, tab);
			ChromeNotifications.warning("你点击了右键菜单！");
		}
	});
}

/** 插件安装 */
chrome.runtime.onInstalled.addListener(async () => {
	console.log("插件安装成功！");
	addContextMenu();
});

/** 插件启用 */
chrome.runtime.onStartup.addListener(async () => {
	console.log("插件启用成功！");
	addContextMenu();
});
