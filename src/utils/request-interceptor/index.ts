import { ProxyRules } from '../proxy-rules';
import { ChromeProxy } from '../chrome-proxy';

export class RequestInterceptor {
	static init() {
		// 监听导航事件来处理代理
		chrome.webNavigation.onBeforeNavigate.addListener(
			async (details) => {
				if (details.frameId === 0) { // 只处理主框架
					const url = details.url;
					const proxyConfig = ProxyRules.matchUrl(url);

					if(proxyConfig) {
						try {
							await ChromeProxy.setProxy(proxyConfig);
						} catch (error) {
							console.error('设置代理失败:', error);
						}
					}
				}
			}
		);

		// 监听标签页更新
		chrome.tabs.onUpdated.addListener(
			async (tabId, changeInfo, tab) => {
				if (changeInfo.status === 'loading' && tab.url) {
					const proxyConfig = ProxyRules.matchUrl(tab.url);

					if(proxyConfig) {
						try {
							await ChromeProxy.setProxy(proxyConfig);
						} catch (error) {
							console.error('设置代理失败:', error);
						}
					}
				}
			}
		);
	}
}
