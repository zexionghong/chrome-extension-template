# chrome-extension-template

谷歌插件模板

```
chrome-extension-template
├─ .editorconfig
├─ .git
│  ├─ config
│  ├─ description
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ objects
│  │  ├─ info
│  │  └─ pack
│  │     ├─ pack-960a4314c093abda5ee64bc7263256ed31cf4571.idx
│  │     ├─ pack-960a4314c093abda5ee64bc7263256ed31cf4571.pack
│  │     └─ pack-960a4314c093abda5ee64bc7263256ed31cf4571.rev
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     └─ HEAD
│     └─ tags
├─ .gitignore
├─ .prettierignore
├─ .prettierrc.json
├─ env.d.ts
├─ eslint.config.js
├─ manifest.config.ts
├─ package.json
├─ pnpm-lock.yaml
├─ public
│  ├─ favicon.ico
│  └─ images
│     ├─ icons
│     │  ├─ icon-128.png
│     │  ├─ icon-16.png
│     │  ├─ icon-32.png
│     │  └─ icon-48.png
│     └─ notifications-icon
│        ├─ error.png
│        └─ warning.png
├─ README.md
├─ src
│  ├─ background
│  │  └─ background.ts
│  ├─ pages
│  │  ├─ 404
│  │  │  ├─ App.vue
│  │  │  ├─ index.html
│  │  │  └─ main.ts
│  │  ├─ content
│  │  │  ├─ App.vue
│  │  │  └─ main.ts
│  │  ├─ popup
│  │  │  ├─ App.vue
│  │  │  ├─ assets
│  │  │  │  ├─ base.css
│  │  │  │  ├─ logo.svg
│  │  │  │  └─ main.css
│  │  │  ├─ components
│  │  │  │  ├─ HelloWorld.vue
│  │  │  │  ├─ icons
│  │  │  │  │  ├─ IconCommunity.vue
│  │  │  │  │  ├─ IconDocumentation.vue
│  │  │  │  │  ├─ IconEcosystem.vue
│  │  │  │  │  ├─ IconSupport.vue
│  │  │  │  │  └─ IconTooling.vue
│  │  │  │  ├─ TheWelcome.vue
│  │  │  │  └─ WelcomeItem.vue
│  │  │  ├─ index.html
│  │  │  ├─ main.ts
│  │  │  ├─ router
│  │  │  │  └─ index.ts
│  │  │  ├─ stores
│  │  │  │  └─ counter.ts
│  │  │  └─ views
│  │  │     ├─ AboutView.vue
│  │  │     └─ HomeView.vue
│  │  └─ side-panel
│  │     ├─ App.vue
│  │     ├─ index.html
│  │     └─ main.ts
│  ├─ request
│  │  ├─ index.ts
│  │  └─ types.ts
│  └─ utils
│     ├─ chrome-context-menus
│     │  ├─ index.ts
│     │  ├─ menu-id.ts
│     │  └─ types.ts
│     ├─ chrome-message
│     │  ├─ event-name.ts
│     │  ├─ index.ts
│     │  └─ types.ts
│     ├─ chrome-notifications
│     │  ├─ index.ts
│     │  └─ types.ts
│     └─ tools.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```