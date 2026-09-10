/**
 * 少女前线2：追放 游戏资料卡片的共享工具（数据整形 / 文案 / 格式化）。
 *
 * 原实现全部内联在 GFLProfile.astro 单文件里；改为 rehype 层手写的文章内嵌卡
 * （src/plugins/rehype-component-gfl2-card.mjs，对应 ::gfl2{} 指令）后，这些纯函数
 * 需要被插件复用，因此抽到 utils 作为唯一数据源，避免逻辑散落多处各写一遍。
 */

export interface StageItem {
	name?: string;
	stage_name?: string;
	complete_percent?: number;
	max_score?: number;
	show_pic?: string;
	case_id?: number;
	stay_stage?: number;
	stage_code?: string;
	stage_rank?: string;
}

export interface HeroItem {
	name?: string;
	lv?: number | string;
	grade?: number | string;
	skin?: string;
	show_pic?: string;
}

export interface ThemeItem {
	case_id?: number;
	complete_percent?: number;
	show_pic?: string;
}

export interface Gfl2CommunityFile {
	fetchedAt: string;
	enabled: boolean;
	ok: boolean;
	message?: string;
	data: {
		base_info?: Record<string, string | number>;
		user_info?: Record<string, string | number | boolean>;
		hero_list?: HeroItem[];
		stage_info?: Record<string, StageItem | StageItem[]>;
		theme_info?: ThemeItem[];
	};
}

/** 展平后的战绩条目：key 为 stage_info 的原始键名（用于 week_* 等特判） */
export type FlatStage = { key: string; item: StageItem };

/** repo 卡信息条的一项；icon 决定遮罩图形，dot 为纯色圆点（仿 GitHub language 点） */
export interface Gfl2RepoInfo {
	icon: "star" | "fork" | "license" | "dot";
	text: string;
	/** dot 的颜色，默认主题主色 */
	color?: string;
	title?: string;
}

function has(x: unknown): boolean {
	return x !== null && x !== undefined && x !== "";
}

/** 展平 stage_info：数组拆开、对象保留，带原键名便于特判 */
export function flattenStages(si: unknown): FlatStage[] {
	const out: FlatStage[] = [];
	if (!si || typeof si !== "object") return out;
	for (const [k, v] of Object.entries(si as Record<string, unknown>)) {
		if (Array.isArray(v)) {
			for (const it of v) out.push({ key: k, item: it as StageItem });
		} else if (v && typeof v === "object") {
			out.push({ key: k, item: v as StageItem });
		}
	}
	return out;
}

/** 单条战绩 → 指标文案（stage_name 优先，无则按字段猜指标名） */
export function stageCaption(s: FlatStage): string {
	const it = s.item;
	if (has(it.stage_name)) {
		let val = "";
		if (has(it.complete_percent))
			val = String(it.complete_percent) + (s.key === "tower_stage" ? "%" : "");
		else if (has(it.max_score)) val = String(it.max_score);
		else if (has(it.stay_stage)) val = "停留 " + String(it.stay_stage);
		return val ? `${it.stage_name} ${val}` : String(it.stage_name);
	}
	const pairs: string[] = [];
	if (has(it.max_score)) pairs.push(`最高积分 ${it.max_score}`);
	if (has(it.stage_rank)) pairs.push(`段位 ${it.stage_rank}`);
	if (has(it.complete_percent)) pairs.push(`完成度 ${it.complete_percent}%`);
	if (has(it.stay_stage)) pairs.push(`停留关卡 ${it.stay_stage}`);
	return pairs.join(" · ") || it.stage_code || "";
}

/**
 * 单条战绩卡片左下指标区的展示数据（对齐 gf2bbsapi Admin.vue 的分支逻辑）：
 * - 周常歧路（week_special）与扩编实练（kuobian_stage）：stage_code → 代码徽章；
 *   caption 只取 stage_name（不再拼数值）；stage_code/stage_name 皆空 → 「暂未参与」
 * - 其它战绩（含 week_common 要塞伯爵常规）：stage_code → 代码徽章；stageCaption → 指标文案
 */
export function stageMetrics(s: FlatStage): {
	chip: string;
	caption: string;
	isEmpty: boolean;
} {
	const it = s.item;
	if (s.key === "kuobian_stage" || s.key === "week_special") {
		const chip = it.stage_code || "";
		const caption = it.stage_name || "";
		return { chip, caption, isEmpty: !has(it.stage_code) && !has(it.stage_name) };
	}
	return { chip: it.stage_code || "", caption: stageCaption(s), isEmpty: false };
}

/** 卡片 title（悬停提示）：与卡片下方指标区展示保持一致 */
export function stageTitle(s: FlatStage): string {
	const m = stageMetrics(s);
	const name = s.item.name || s.key;
	if (m.isEmpty) return `${name} · 暂未参与`;
	if (m.caption && m.caption !== name) return `${name} · ${m.caption}`;
	return name;
}

/**
 * 时间格式化：显式指定北京时间。
 * 博客为静态构建，构建机时区（CF Pages = UTC）会污染 toLocaleString 的本地时区默认值。
 */
export function fmtTime(iso: string): string {
	try {
		return new Date(iso).toLocaleString("zh-CN", {
			hour12: false,
			timeZone: "Asia/Shanghai",
		});
	} catch {
		return iso;
	}
}

/** 数值格式化：超过一万折算成「万」，便于信息条显示 */
export function pct(v: unknown): string {
	if (typeof v !== "number") return "—";
	if (v >= 10000) return `${(v / 10000).toFixed(1)}万`;
	return v.toLocaleString();
}

/** 把「有值才显示」的若干片段用分隔符拼起来（用于卡片描述行） */
export function joinParts(parts: (string | undefined | null)[], sep = " · "): string {
	return parts.filter((p) => has(p)).join(sep);
}
