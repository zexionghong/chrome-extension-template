<template>
	<div class="proxy-manager">
		<header class="header">
			<h1>代理管理器</h1>
			<button class="icon-btn add-btn" @click="showAddForm = true">
				<i class="fas fa-plus"></i>
			</button>
		</header>

		<!-- 代理列表 -->
		<div class="proxy-list" :class="{ empty: Object.keys(proxyConfigs).length === 0 }">
			<template v-if="Object.keys(proxyConfigs).length > 0">
				<div v-for="(config, name) in proxyConfigs" :key="name"
					class="proxy-card"
					:class="{ active: name === activeConfig }">
					<div class="proxy-card-header">
						<span class="proxy-name">{{ name }}</span>
						<div class="proxy-type">{{ config.scheme.toUpperCase() }}</div>
					</div>
					<div class="proxy-card-body">
						<div class="proxy-address">
							<i class="fas fa-server"></i>
							{{ config.host }}:{{ config.port }}
						</div>
						<div class="proxy-auth" v-if="config.username">
							<i class="fas fa-user-shield"></i>
							{{ config.username }}
						</div>
					</div>
					<div class="proxy-card-footer">
						<button class="btn-text" @click="activateProxy(name, config)"
							:class="{ active: name === activeConfig }">
							<i class="fas fa-power-off"></i>
							{{ name === activeConfig ? '已启用' : '启用' }}
						</button>
						<button class="btn-text danger" @click="deleteProxy(name)">
							<i class="fas fa-trash"></i>
							删除
						</button>
					</div>
				</div>
			</template>
			<div v-else class="empty-state">
				<i class="fas fa-server empty-icon"></i>
				<p>还没有添加任何代理</p>
				<button class="btn primary" @click="showAddForm = true">
					<i class="fas fa-plus"></i>
					添加代理
				</button>
			</div>
		</div>

		<!-- 添加代理表单 -->
		<div class="modal" v-if="showAddForm" @click.self="showAddForm = false">
			<div class="modal-content">
				<div class="modal-header">
					<h2>添加代理</h2>
					<button class="icon-btn" @click="showAddForm = false">
						<i class="fas fa-times"></i>
					</button>
				</div>
				<div class="modal-body">
					<div class="form-group">
						<label>代理名称</label>
						<input type="text" v-model="newProxy.name" placeholder="给代理起个名字">
					</div>
					<div class="form-group">
						<label>代理地址</label>
						<input
							type="text"
							v-model="proxyUrl"
							placeholder="socks5://user:pass@host:port 或 http://host:port"
							@input="parseProxyUrl"
						>
						<div class="form-tips">
							<div class="tip-item">
								<i class="fas fa-info-circle"></i>
								支持格式:
							</div>
							<div class="tip-item">• socks5://username:password@host:port</div>
							<div class="tip-item">• http://username:password@host:port</div>
							<div class="tip-item">• socks5://host:port</div>
							<div class="tip-item">• http://host:port</div>
						</div>
					</div>
					<!-- 显示解析结果 -->
					<div class="parse-result" v-if="isValidUrl">
						<div class="result-item">
							<span class="label">类型:</span>
							<span class="value">{{ newProxy.scheme }}</span>
						</div>
						<div class="result-item">
							<span class="label">地址:</span>
							<span class="value">{{ newProxy.host }}:{{ newProxy.port }}</span>
						</div>
						<div class="result-item" v-if="newProxy.username">
							<span class="label">认证:</span>
							<span class="value">{{ newProxy.username }}</span>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn secondary" @click="showAddForm = false">取消</button>
					<button class="btn primary" @click="addProxy" :disabled="!isValidConfig">添加</button>
				</div>
			</div>
		</div>

		<!-- 底部工具栏 -->
		<footer class="footer" v-if="activeConfig">
			<button class="btn danger full-width" @click="clearProxy">
				<i class="fas fa-power-off"></i>
				关闭代理
			</button>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ProxyStorage } from '@/utils/proxy-storage';
import { ChromeProxy } from '@/utils/chrome-proxy';
import type { ProxyConfig } from '@/utils/chrome-proxy';

const proxyConfigs = ref<Record<string, ProxyConfig>>({});
const activeConfig = ref<string | null>(null);
const showAddForm = ref(false);
const newProxy = ref({
	name: '',
	scheme: 'http',
	host: '',
	port: 0,
	useAuth: false,
	username: '',
	password: ''
});

const proxyUrl = ref('');
const isValidUrl = ref(false);

// 解析代理URL
function parseProxyUrl() {
	try {
		const url = proxyUrl.value;
		if (!url) {
			isValidUrl.value = false;
			return;
		}

		// 匹配代理URL格式
		const regex = /^(socks5|http):\/\/(?:([^:@]+):([^@]+)@)?([^:]+):(\d+)\/?$/;
		const match = url.match(regex);

		if (match) {
			const [, scheme, username, password, host, port] = match;
			newProxy.value = {
				name: newProxy.value.name,
				scheme: scheme as 'socks5' | 'http',
				host,
				port: parseInt(port),
				useAuth: !!username && !!password,
				username: username || '',
				password: password || ''
			};
			isValidUrl.value = true;
		} else {
			isValidUrl.value = false;
		}
	} catch (error) {
		console.error('解析代理URL失败:', error);
		isValidUrl.value = false;
	}
}

// 修改验证逻辑
const isValidConfig = computed(() => {
	return newProxy.value.name && isValidUrl.value;
});

// 加载配置
async function loadConfigs() {
	proxyConfigs.value = await ProxyStorage.getAllProxyConfigs();
	activeConfig.value = await ProxyStorage.getActiveConfig();
}

onMounted(loadConfigs);

// 添加新代理
async function addProxy() {
	const config: ProxyConfig = {
		scheme: newProxy.value.scheme,
		host: newProxy.value.host,
		port: newProxy.value.port
	};

	if (newProxy.value.useAuth) {
		config.username = newProxy.value.username;
		config.password = newProxy.value.password;
	}

	await ProxyStorage.saveProxyConfig(newProxy.value.name, config);
	await loadConfigs();

	// 重置表单
	newProxy.value = {
		name: '',
		scheme: 'http',
		host: '',
		port: 0,
		useAuth: false,
		username: '',
		password: ''
	};
	proxyUrl.value = '';
	isValidUrl.value = false;
	showAddForm.value = false;
}

// 启用代理
async function activateProxy(name: string, config: ProxyConfig) {
	try {
		await ChromeProxy.setProxy(config);
		await ProxyStorage.setActiveConfig(name);
		activeConfig.value = name;
	} catch (error) {
		console.error('启用代理失败:', error);
	}
}

// 删除代理
async function deleteProxy(name: string) {
	await ProxyStorage.deleteProxyConfig(name);
	await loadConfigs();
}

// 清除代理
async function clearProxy() {
	await ChromeProxy.clearProxy();
	await ProxyStorage.setActiveConfig(null);
	activeConfig.value = null;
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* 基础样式 */
:root {
	--primary: #2196F3;
	--primary-light: #64B5F6;
	--primary-dark: #1976D2;
	--danger: #F44336;
	--danger-light: #EF5350;
	--success: #4CAF50;
	--gray-100: #f8f9fa;
	--gray-200: #e9ecef;
	--gray-300: #dee2e6;
	--gray-400: #ced4da;
	--gray-500: #adb5bd;
	--gray-600: #6c757d;
	--gray-700: #495057;
	--gray-800: #343a40;
	--gray-900: #212529;
	--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
	--shadow: 0 1px 3px rgba(0,0,0,0.1);
	--shadow-lg: 0 2px 4px rgba(0,0,0,0.1);
	--radius: 8px;
	--radius-lg: 12px;
}

body {
	margin: 0;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	background: var(--gray-100);
	color: var(--gray-900);
}

/* 布局 */
.proxy-manager {
	width: 360px;
	min-height: 400px;
	max-height: 600px;
	display: flex;
	flex-direction: column;
}

.header {
	padding: 16px;
	background: white;
	box-shadow: var(--shadow);
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: sticky;
	top: 0;
	z-index: 10;
}

.header h1 {
	margin: 0;
	font-size: 1.25rem;
	font-weight: 600;
	color: var(--gray-900);
}

.proxy-list {
	flex: 1;
	overflow-y: auto;
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.proxy-list.empty {
	height: 400px;
}

.footer {
	padding: 16px;
	background: white;
	box-shadow: var(--shadow);
	position: sticky;
	bottom: 0;
}

/* 代理卡片 */
.proxy-card {
	background: white;
	border-radius: var(--radius);
	box-shadow: var(--shadow);
	overflow: hidden;
	transition: all 0.2s;
}

.proxy-card.active {
	box-shadow: var(--shadow-lg);
	border: 1px solid var(--primary-light);
}

.proxy-card-header {
	padding: 12px 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid var(--gray-200);
}

.proxy-name {
	font-weight: 600;
	color: var(--gray-900);
}

.proxy-type {
	font-size: 0.75rem;
	font-weight: 600;
	padding: 2px 8px;
	border-radius: 12px;
	background: var(--gray-200);
	color: var(--gray-700);
}

.proxy-card-body {
	padding: 12px 16px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.proxy-address,
.proxy-auth {
	display: flex;
	align-items: center;
	gap: 8px;
	color: var(--gray-700);
	font-size: 0.875rem;
}

.proxy-card-footer {
	padding: 12px 16px;
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	border-top: 1px solid var(--gray-200);
}

/* 按钮 */
.btn {
	padding: 8px 16px;
	border: none;
	border-radius: var(--radius);
	font-weight: 500;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 8px;
	transition: all 0.2s;
}

.btn.primary {
	background: var(--primary);
	color: white;
}

.btn.primary:hover {
	background: var(--primary-dark);
}

.btn.secondary {
	background: var(--gray-200);
	color: var(--gray-700);
}

.btn.secondary:hover {
	background: var(--gray-300);
}

.btn.danger {
	background: var(--danger);
	color: white;
}

.btn.danger:hover {
	background: var(--danger-light);
}

.btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-text {
	padding: 6px 12px;
	border: none;
	background: none;
	color: var(--gray-600);
	font-weight: 500;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	transition: all 0.2s;
}

.btn-text:hover {
	color: var(--gray-900);
}

.btn-text.active {
	color: var(--primary);
}

.btn-text.danger {
	color: var(--danger);
}

.icon-btn {
	width: 32px;
	height: 32px;
	border: none;
	border-radius: 50%;
	background: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
}

.icon-btn:hover {
	background: var(--gray-200);
}

.full-width {
	width: 100%;
}

/* 模态框 */
.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 100;
}

.modal-content {
	background: white;
	border-radius: var(--radius-lg);
	width: 90%;
	max-width: 320px;
	max-height: 90vh;
	overflow-y: auto;
}

.modal-header {
	padding: 16px;
	border-bottom: 1px solid var(--gray-200);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.modal-header h2 {
	margin: 0;
	font-size: 1.125rem;
	font-weight: 600;
}

.modal-body {
	padding: 16px;
}

.modal-footer {
	padding: 16px;
	border-top: 1px solid var(--gray-200);
	display: flex;
	justify-content: flex-end;
	gap: 12px;
}

/* 表单 */
.form-group {
	margin-bottom: 16px;
}

.form-row {
	display: flex;
	gap: 12px;
	margin-bottom: 16px;
}

.flex-grow {
	flex: 1;
}

label {
	display: block;
	margin-bottom: 6px;
	font-weight: 500;
	color: var(--gray-700);
}

input[type="text"],
input[type="number"],
input[type="password"] {
	width: 100%;
	padding: 8px 12px;
	border: 1px solid var(--gray-300);
	border-radius: var(--radius);
	font-size: 0.875rem;
	transition: all 0.2s;
}

input:focus {
	outline: none;
	border-color: var(--primary);
	box-shadow: 0 0 0 3px rgba(33,150,243,0.1);
}

.radio-group {
	display: flex;
	gap: 16px;
}

.radio-btn {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	cursor: pointer;
}

.checkbox-label {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	cursor: pointer;
}

/* 滚动条美化 */
::-webkit-scrollbar {
	width: 8px;
}

::-webkit-scrollbar-track {
	background: var(--gray-100);
}

::-webkit-scrollbar-thumb {
	background: var(--gray-300);
	border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
	background: var(--gray-400);
}

/* 添加空状态样式 */
.empty-state {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 64px 16px;
	color: var(--gray-500);
}

.empty-icon {
	font-size: 64px;
	margin-bottom: 16px;
	opacity: 0.5;
}

.empty-state p {
	margin: 0 0 20px;
	font-size: 0.875rem;
}

/* 添加新样式 */
.form-tips {
	margin-top: 8px;
	font-size: 0.75rem;
	color: var(--gray-600);
}

.tip-item {
	margin: 2px 0;
	display: flex;
	align-items: center;
	gap: 4px;
}

.tip-item i {
	font-size: 12px;
}

.parse-result {
	margin-top: 16px;
	padding: 12px;
	background: var(--gray-100);
	border-radius: var(--radius);
	font-size: 0.875rem;
}

.result-item {
	display: flex;
	align-items: center;
	margin: 4px 0;
}

.result-item .label {
	width: 60px;
	color: var(--gray-600);
}

.result-item .value {
	color: var(--gray-900);
	font-family: monospace;
}
</style>
