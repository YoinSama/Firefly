import { fetchAndWrite } from "../../scripts/fetch-gfl2-community";

/**
 * Astro 集成：在 `astro dev` 启动时自动拉取最新游戏资料，
 * 写入 src/constants/gfl2-community.json（pkg build 时由 package.json scripts 前置执行同一脚本）。
 *
 * 直接调用脚本导出的 fetchAndWrite（而非 spawn 子进程）：
 *   - 跨平台无 npx 路径问题（Windows 下 spawn npx 会 ENOENT）；
 *   - 脚本自身对所有失败仅 warn + 写空结构，集成再 try/catch 兜底，
 *     双保险保证 dev/build 绝不因源站不稳定而卡死。
 */
export default function fetchGfl2CommunityIntegration() {
	return {
		name: "fetch-gfl2-community",
		hooks: {
			"astro:server:start": async () => {
				try {
					await fetchAndWrite();
				} catch (e: any) {
					console.warn("[gfl2] dev 拉取脚本异常（已忽略）：", e?.message || e);
				}
			},
		},
	};
}
