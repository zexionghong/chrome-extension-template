import type { ProxyConfig } from '../chrome-proxy';

export class ProxyStorage {
	private static readonly PROXY_CONFIG_KEY = 'proxy_configs';
	private static readonly ACTIVE_CONFIG_KEY = 'active_proxy';

	// 保存代理配置
	static async saveProxyConfig(name: string, config: ProxyConfig) {
		const configs = await this.getAllProxyConfigs();
		configs[name] = config;
		await chrome.storage.local.set({ [this.PROXY_CONFIG_KEY]: configs });
	}

	// 获取所有代理配置
	static async getAllProxyConfigs(): Promise<Record<string, ProxyConfig>> {
		const result = await chrome.storage.local.get(this.PROXY_CONFIG_KEY);
		return result[this.PROXY_CONFIG_KEY] || {};
	}

	// 删除代理配置
	static async deleteProxyConfig(name: string) {
		const configs = await this.getAllProxyConfigs();
		delete configs[name];
		await chrome.storage.local.set({ [this.PROXY_CONFIG_KEY]: configs });

		// 如果删除的是当前活动的配置，清除活动配置
		const activeConfig = await this.getActiveConfig();
		if (activeConfig === name) {
			await this.setActiveConfig(null);
		}
	}

	// 设置活动代理配置
	static async setActiveConfig(name: string | null) {
		await chrome.storage.local.set({ [this.ACTIVE_CONFIG_KEY]: name });
	}

	// 获取活动代理配置名称
	static async getActiveConfig(): Promise<string | null> {
		const result = await chrome.storage.local.get(this.ACTIVE_CONFIG_KEY);
		return result[this.ACTIVE_CONFIG_KEY] || null;
	}
}
