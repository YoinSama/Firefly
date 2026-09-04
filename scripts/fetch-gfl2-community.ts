import fs from "node:fs/promises";
import path from "node:path";
import { gfl2CommunityConfig } from "../src/config/gfl2CommunityConfig";

/**
 * 拉取 GFL2 游戏资料并写入 src/constants/gfl2-community.json。
 *
 * 设计原则（与 generate-github-card-data.ts / generate-lqips.ts 一致）：
 *   - 用 node:fs/promises（promise 版 writeFile，无 callback 陷阱）。
 *   - 仅写入接口响应的 data 字段，**绝不回写 token / 完整 key / 上游 Code/Message 壳**。
 *   - 任何失败（源站挂、网络不通、API Key 无效）仅输出空结构 + console.warn，
 *     退出码恒为 0，**绝不阻塞 pnpm build**——博客仍能发布。
 *
 * 触发时机：
 *   - pnpm dev：Astro 集成 fetch-gfl2-community 在 astro:server:start 中 spawn 本脚本。
 *   - pnpm build：在 astro build 之前由 package.json scripts 顺序调用。
 */

const OUTPUT_FILE = path.resolve("src/constants/gfl2-community.json");

interface Gfl2CommunityStage {
	name?: string;
	stage_name?: string;
	complete_percent?: number;
	show_pic?: string;
	stage_code?: string;
	case_id?: number;
	stay_stage?: number;
}

interface Gfl2CommunityData {
	base_info?: Record<string, unknown>;
	user_info?: Record<string, unknown>;
	hero_list?: any[];
	stage_info?: Record<string, Gfl2CommunityStage | Gfl2CommunityStage[]>;
	theme_info?: any[];
}

interface Gfl2CommunityFile {
	fetchedAt: string;
	enabled: boolean;
	ok: boolean;
	message?: string;
	data: Gfl2CommunityData;
}

const EMPTY_DATA: Gfl2CommunityData = {
	base_info: {},
	user_info: {},
	hero_list: [],
	stage_info: {},
	theme_info: [],
};

function resolveApiKey(): string {
	const fromConfig = gfl2CommunityConfig.api?.apiKey?.trim();
	if (fromConfig) return fromConfig;
	const fromEnv = process.env.GFL2_API_KEY?.trim();
	if (fromEnv) return fromEnv;
	return "";
}

async function writeEmpty(reason: string, enabled: boolean): Promise<void> {
	const file: Gfl2CommunityFile = {
		fetchedAt: new Date().toISOString(),
		enabled,
		ok: false,
		message: reason,
		data: EMPTY_DATA,
	};
	await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
	await fs.writeFile(OUTPUT_FILE, JSON.stringify(file, null, 2), "utf-8");
	console.warn(`[fetch-gfl2-community] ${reason}（已写入空结构，构建不会阻塞）`);
}

async function fetchAndWrite(): Promise<void> {
	if (!gfl2CommunityConfig.enable) {
		await writeEmpty("GFL2 社区资料展示未启用（gfl2CommunityConfig.enable=false）", false);
		return;
	}

	const apiKey = resolveApiKey();
	if (!apiKey) {
		await writeEmpty(
			"GFL2 API Key 未配置（请在 src/config/gfl2CommunityConfig.ts 的 api.apiKey 填写，或设置环境变量 GFL2_API_KEY）",
			true,
		);
		return;
	}

	const base = gfl2CommunityConfig.api.base.replace(/\/+$/, "");
	const url = `${base}/api/community/community/game/info`;

	let resp: Response;
	try {
		resp = await fetch(url, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-api-key": apiKey,
			},
			body: "{}",
			signal: AbortSignal.timeout(15_000),
		});
	} catch (e: any) {
		await writeEmpty(`网络请求失败：${e?.message || e}`, true);
		return;
	}

	if (!resp.ok) {
		await writeEmpty(`HTTP ${resp.status}（鉴权失败或源站异常）`, true);
		return;
	}

	let payload: any;
	try {
		payload = await resp.json();
	} catch (e: any) {
		await writeEmpty(`响应 JSON 解析失败：${e?.message || e}`, true);
		return;
	}

	if (payload?.Code !== 0 || !payload?.data) {
		await writeEmpty(
			`上游返回异常：Code=${payload?.Code ?? "?"} Message=${payload?.Message ?? "?"}`,
			true,
		);
		return;
	}

	const heroList = Array.isArray(payload.data.hero_list)
		? payload.data.hero_list
		: [];

	const file: Gfl2CommunityFile = {
		fetchedAt: new Date().toISOString(),
		enabled: true,
		ok: true,
		data: {
			base_info: payload.data.base_info ?? {},
			user_info: payload.data.user_info ?? {},
			hero_list: heroList,
			stage_info: payload.data.stage_info ?? {},
			theme_info: payload.data.theme_info ?? [],
		},
	};

	await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
	await fs.writeFile(OUTPUT_FILE, JSON.stringify(file, null, 2), "utf-8");
	console.log(
		`[fetch-gfl2-community] 已写入 ${heroList.length} 个人形 / ${Object.keys(file.data.stage_info ?? {}).length} 个战绩分组到 ${OUTPUT_FILE}`,
	);
}

// CLI 入口（集成内通过子进程调用同一脚本）
const isMain =
	import.meta.url === `file://${process.argv[1]}` ||
	process.argv[1]?.endsWith("fetch-gfl2-community.ts");

if (isMain) {
	fetchAndWrite().catch((e) => {
		// 双保险：任何未捕获异常都兜底为空结构 + warn
		console.error("[fetch-gfl2-community] 未捕获异常：", e);
		writeEmpty(`未捕获异常：${e?.message || e}`, gfl2CommunityConfig.enable).then(() =>
			process.exit(0),
		);
	});
}

export { fetchAndWrite, OUTPUT_FILE };
