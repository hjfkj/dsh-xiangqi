/**
 * 把 game/xiangqi.html 重新打包进 lib/client.js
 *
 * 用法：npm run build
 * 改了游戏本体之后跑一次，插件里的那份才会跟着更新。
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const gamePath = path.join(root, 'game', 'xiangqi.html');
const outPath = path.join(root, 'lib', 'client.js');

if (!fs.existsSync(gamePath)) {
  console.error('找不到 game/xiangqi.html');
  process.exit(1);
}

const html = fs.readFileSync(gamePath, 'utf8');
const jsStr = JSON.stringify(html);

const src = `window.__ModuleLoader__.load({
	id: "dsh-xiangqi",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		var react = require("react");

		/** The whole game: one self-contained HTML document (engine + UI + sound + chat). */
		var GAME_HTML = ${jsStr};

		var PANEL_ID = "dsh-xiangqi-panel";

		function XiangqiIcon() {
			return react.createElement("span", {
				"aria-hidden": "true",
				style: {
					display: "inline-flex", alignItems: "center", justifyContent: "center",
					width: "1.15em", height: "1.15em", fontSize: "1.02em", lineHeight: 1, fontWeight: 700
				}
			}, "\\u8c61");
		}

		function XiangqiPage() {
			return react.createElement("div", {
				style: { width: "100%", height: "100%", minHeight: "620px", display: "flex" }
			}, react.createElement("iframe", {
				title: "\\u4e2d\\u56fd\\u8c61\\u68cb",
				srcDoc: GAME_HTML,
				sandbox: "allow-scripts allow-same-origin allow-modals allow-popups allow-downloads allow-forms",
				style: {
					flex: "1 1 auto", width: "100%", height: "100%", border: "0",
					display: "block", background: "#0b1016"
				}
			}));
		}

		function apply(ctx) {
			var disposers = [];
			var slots = ctx && ctx.slots;
			if (!slots) return function () {};
			try {
				disposers.push(slots.inject("sidebar.panellist", function () {
					return slots.register({
						name: "sidebar.panellist",
						id: PANEL_ID,
						order: 400,
						label: function () { return "\\u8c61\\u68cb"; }
					}, XiangqiIcon);
				}));
			} catch (e) { /* never break the host boot */ }
			try {
				disposers.push(slots.inject("main", function () {
					return slots.register({ name: "main", key: PANEL_ID }, XiangqiPage);
				}));
			} catch (e) { /* never break the host boot */ }
			return function () {
				for (var i = 0; i < disposers.length; i++) {
					try { disposers[i](); } catch (e) {}
				}
				disposers.length = 0;
			};
		}

		var inject = ["slots"];
		exports.apply = apply;
		exports.inject = inject;
		exports.PANEL_ID = PANEL_ID;
		exports.GAME_HTML = GAME_HTML;
		return module.exports;
	}
});
`;

fs.writeFileSync(outPath, src, 'utf8');
console.log('lib/client.js 已更新 | 游戏 ' + html.length + ' 字节 | 模块 ' + src.length + ' 字节');
