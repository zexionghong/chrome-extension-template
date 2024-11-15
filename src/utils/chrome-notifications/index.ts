/*
 * @Author: mulingyuer
 * @Date: 2024-11-15 16:11:57
 * @LastEditTime: 2024-11-15 18:26:05
 * @LastEditors: mulingyuer
 * @Description: 谷歌浏览器通知
 * @FilePath: \chrome-extension-template\src\utils\chrome-notifications\index.ts
 * 怎么可能会有bug！！！
 */
import type { ErrorNotificationOptions, WarningNotificationOptions } from "./types";
import errorIcon from "@/assets/images/notifications-icon/error.png";
import warningIcon from "@/assets/images/notifications-icon/warning.png";

export class ChromeNotifications {
	/** 错误通知 */
	static error(options: ErrorNotificationOptions | string) {
		let title = "发生错误";
		let message = "";

		if (typeof options === "string") {
			message = options;
		} else {
			title = options.title ?? title;
			message = options.message;
		}

		chrome.notifications.create({
			type: "basic",
			iconUrl: errorIcon,
			title,
			message,
			priority: 0
		});
	}

	/** 警告通知 */
	static warning(options: WarningNotificationOptions | string) {
		let title = "警告";
		let message = "";

		if (typeof options === "string") {
			message = options;
		} else {
			title = options.title ?? title;
			message = options.message;
		}

		chrome.notifications.create({
			type: "basic",
			iconUrl: warningIcon,
			title,
			message,
			priority: 0
		});
	}
}
