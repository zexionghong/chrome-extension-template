export interface ProxyConfig {
	scheme: string;     // 代理协议
	host: string;       // 代理服务器
	port: number;       // 代理端口
	username?: string;  // 认证用户名
	password?: string;  // 认证密码
}

export class ChromeProxy {
	// 设置代理
	static async setProxy(config: ProxyConfig) {
		try {
			const proxyConfig = {
				mode: "fixed_servers",
				rules: {
					singleProxy: {
						scheme: config.scheme,
						host: config.host,
						port: config.port
					},
					bypassList: ["localhost"]
				}
			};

			await chrome.proxy.settings.set({
				value: proxyConfig,
				scope: 'regular'
			});

			// 简化认证处理
			if(config.username && config.password) {
				chrome.webRequest.onAuthRequired.addListener(
					() => ({
						authCredentials: {
							username: config.username!,
							password: config.password!
						}
					}),
					{urls: ["<all_urls>"]}
				);
			}
		} catch (error) {
			console.error('设置代理失败:', error);
			throw error;
		}
	}

	// 清除代理
	static async clearProxy() {
		await chrome.proxy.settings.clear({scope: 'regular'});
	}

	// 获取当前代理配置
	static async getCurrentProxy() {
		const config = await chrome.proxy.settings.get({});
		return config;
	}
}
