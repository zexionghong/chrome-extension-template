/*
 * @Author: mulingyuer
 * @Date: 2024-11-15 10:09:16
 * @LastEditTime: 2024-11-15 17:46:53
 * @LastEditors: mulingyuer
 * @Description: background脚本
 * @FilePath: \chrome-extension-template\src\background\background.ts
 * 怎么可能会有bug！！！
 */
import { ProxyStorage } from '@/utils/proxy-storage';
import { ChromeProxy } from '@/utils/chrome-proxy';

// 确保在扩展环境中运行
if (chrome && chrome.runtime) {
	// 监听安装事件
	chrome.runtime.onInstalled.addListener(() => {
		console.log('代理扩展已安装');
	});

	// 监听代理配置变更
	if (chrome.storage) {
		chrome.storage.onChanged.addListener((changes) => {
			if (changes.proxy_configs) {
				console.log('代理配置已更新');
				handleProxyConfigChange();
			}
		});
	}

	// 监听标签页更新
	if (chrome.tabs) {
		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			if (changeInfo.status === 'loading' && tab.url) {
				handleTabUpdate();
			}
		});
	}
}

// 处理代理配置变更
async function handleProxyConfigChange() {
	try {
		const activeConfig = await ProxyStorage.getActiveConfig();
		if (activeConfig) {
			const configs = await ProxyStorage.getAllProxyConfigs();
			if (configs[activeConfig]) {
				await ChromeProxy.setProxy(configs[activeConfig]);
			}
		}
	} catch (error) {
		console.error('处理代理配置变更失败:', error);
	}
}

// 处理标签页更新
async function handleTabUpdate() {
	try {
		const configs = await ProxyStorage.getAllProxyConfigs();
		const activeConfig = await ProxyStorage.getActiveConfig();

		if (activeConfig && configs[activeConfig]) {
			await ChromeProxy.setProxy(configs[activeConfig]);
		}
	} catch (error) {
		console.error('设置代理失败:', error);
	}
}

// 导出一个空对象以满足模块要求
export {};
