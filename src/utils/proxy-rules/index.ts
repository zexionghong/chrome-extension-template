export interface ProxyRule {
	pattern: string;    // URL匹配模式
	proxyConfig: ProxyConfig; // 使用的代理配置
}

export class ProxyRules {
	private static rules: ProxyRule[] = [];

	// 添加规则
	static addRule(rule: ProxyRule) {
		this.rules.push(rule);
	}

	// 移除规则
	static removeRule(pattern: string) {
		this.rules = this.rules.filter(r => r.pattern !== pattern);
	}

	// 匹配URL应该使用的代理
	static matchUrl(url: string): ProxyConfig | null {
		for(const rule of this.rules) {
			if(new RegExp(rule.pattern).test(url)) {
				return rule.proxyConfig;
			}
		}
		return null;
	}
}
