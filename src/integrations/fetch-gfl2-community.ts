import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Astro 集成：在 `astro dev` 启动时自动跑 scripts/fetch-gfl2-community.ts，
 * 让 dev 阶段也能拿到最新游戏资料（cf Pages 构建时由 package.json scripts 顺序前置）。
 *
 * 双保险设计：脚本自身对所有失败仅 warn + exit 0，本集成也吞掉子进程退出码，
 * 绝不阻塞 Astro 启动——博客 dev/build 不被源站稳定性绑架。
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.resolve(__dirname, "../../scripts/fetch-gfl2-community.ts");

function runScript(): void {
	const child = spawn("npx", ["tsx", SCRIPT], {
		stdio: "inherit",
		shell: false,
	});
	child.on("error", (err) => {
		console.warn("[gfl2] dev 拉取脚本启动失败（已忽略）：", err?.message || err);
	});
	child.on("exit", (code) => {
		if (code && code !== 0) {
			console.warn(`[gfl2] dev 拉取脚本退出码 ${code}（脚本本身已保证不阻塞）`);
		}
	});
}

export default function fetchGfl2CommunityIntegration() {
	return {
		name: "fetch-gfl2-community",
		hooks: {
			"astro:server:start": () => {
				runScript();
			},
		},
	};
}
