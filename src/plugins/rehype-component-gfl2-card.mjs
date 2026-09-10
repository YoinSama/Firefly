/// <reference types="mdast" />
import { h } from "hastscript";
import gfl2Community from "../constants/gfl2-community.json" with {
	type: "json",
};
import { gfl2CommunityConfig } from "../config/gfl2CommunityConfig.ts";
import {
	flattenStages,
	fmtTime,
	pct,
	stageMetrics,
	stageTitle,
} from "../utils/gfl2-utils.ts";

/**
 * 文章内嵌的 GFL2 游戏资料卡（::gfl2 指令）。
 *
 * 皮肤 / 结构 = about 页那张资料卡（改造前的 GFLProfile 旧版）：
 *   card-base 外框 → 标题栏（游戏资料 + 数据来源）→ 头像资料区 + 6 格统计
 *   → 「人形展示」立绘横卷 → 「游戏战绩」（周常横卷 + 玩法网格）→ 「主题档案」折叠
 * 样式在 src/styles/markdown-extend.styl 的 .gfl2-embed 段（从旧版 CSS 逐条搬来）。
 *
 * rehype 层只能拼 HTML 字符串（hast），不能渲染 .astro 组件，所以这里是手写实现。
 *
 * 用法（叶子指令，不能带正文）：
 *   ::gfl2{}                      完整卡片（默认：8 人形 + 战绩 + 主题）
 *   ::gfl2{heroes="4"}            人形只留 4 名（0 = 不显示人形）
 *   ::gfl2{stages="false"}        不显示战绩
 *   ::gfl2{themes="false"}        不显示主题档案
 *
 * @param {Object} properties - 指令属性
 * @param {import('mdast').RootContent[]} children - 指令子节点（必须为空）
 * @returns {import('hast').Element}
 */
export function Gfl2CardComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h(
			"div",
			{ class: "hidden" },
			'Invalid directive. ("gfl2" directive must be leaf type "::gfl2{}")',
		);

	const cfg = gfl2CommunityConfig;
	const file = gfl2Community;

	// 没启用或没拉到数据 → 隐藏占位，不在文章里留空壳卡片
	if (!cfg?.enable || !file?.ok) return h("div", { class: "hidden" });

	const data = file.data ?? {};
	const user = data.user_info ?? {};
	const base = data.base_info ?? {};

	const heroLimit = properties.heroes === undefined ? 8 : Number(properties.heroes) || 0;
	const heroes = heroLimit > 0 ? (data.hero_list ?? []).slice(0, heroLimit) : [];
	const showStages = String(properties.stages ?? "true") !== "false";
	const showThemes = String(properties.themes ?? "true") !== "false";

	const allStages = showStages ? flattenStages(data.stage_info) : [];
	const weekStages = allStages.filter((s) => s.key.startsWith("week_"));
	const otherStages = allStages.filter((s) => !s.key.startsWith("week_"));
	const themes = showThemes ? (data.theme_info ?? []).slice(0, 12) : [];

	// ---- 标题栏 ----
	const nHead = h("header", { class: "gfl2-head" }, [
		h("div", { class: "gfl2-head-text" }, [
			h("h3", { class: "gfl2-title" }, "少女前线2：追放 · 游戏资料"),
			h(
				"p",
				{
					class: "gfl2-sub",
					title: `数据更新于 ${fmtTime(file.fetchedAt)}`,
				},
				cfg.link?.text || "数据来源于《少女前线2：追放》官方社区",
			),
		]),
	]);

	// ---- 基础资料：头像 + 昵称/UID + 公会/等级 + 6 格统计 ----
	const stat = (val, label) =>
		h("div", { class: "gfl2-stat" }, [
			h("span", { class: "gfl2-stat-val" }, val),
			h("span", { class: "gfl2-stat-label" }, label),
		]);

	const stats = [
		base.main_stage ? stat(String(base.main_stage), "主线进度") : null,
		base.hero_count != null ? stat(pct(base.hero_count), "人形") : null,
		base.active_days != null ? stat(pct(base.active_days), "活跃天数") : null,
		base.skin_count != null ? stat(pct(base.skin_count), "皮肤") : null,
		base.weapon_count != null ? stat(pct(base.weapon_count), "武器") : null,
		base.achievement_count != null ? stat(pct(base.achievement_count), "成就") : null,
	].filter(Boolean);

	const nProfile = h("section", { class: "gfl2-profile" }, [
		h("div", { class: "gfl2-profile-head" }, [
			user.avatar
				? h("img", {
						src: String(user.avatar),
						alt: String(user.nick_name ?? "avatar"),
						class: "gfl2-avatar",
						referrerpolicy: "no-referrer",
						loading: "lazy",
					})
				: null,
			h("div", {}, [
				h("div", { class: "gfl2-name" }, [
					h("span", { class: "gfl2-nick" }, String(user.nick_name ?? "未知用户")),
					h("span", { class: "gfl2-uid" }, `#${user.game_uid ?? user.uid ?? "?"}`),
				]),
				h("div", { class: "gfl2-subline" }, [
					user.guild_name
						? h("span", { class: "gfl2-muted" }, `公会：${user.guild_name}`)
						: null,
					user.level
						? h("span", { class: "gfl2-muted" }, `指挥等级：${user.level}`)
						: null,
				].filter(Boolean)),
			]),
		]),
		stats.length > 0 ? h("div", { class: "gfl2-stats" }, stats) : null,
	].filter(Boolean));

	// ---- 人形展示：横向滚动立绘条 ----
	const nHeroes =
		heroes.length > 0
			? h(
					"section",
					{ class: "gfl2-section" },
					[
						h("h4", { class: "gfl2-h4" }, [
							"人形展示",
							h("span", { class: "gfl2-h4-note" }, `公开的前 ${heroes.length} 名`),
						]),
						h(
							"div",
							{ class: "gfl2-dolls" },
							heroes.map((hero) =>
								h(
									"div",
									{
										class: "gfl2-doll",
										title: [
											hero.name ?? "",
											hero.lv != null ? `lv.${hero.lv}` : "",
											hero.grade != null && hero.grade !== "" ? `椎体 ${hero.grade}` : "",
										]
											.filter(Boolean)
											.join(" · "),
									},
									[
										hero.skin || hero.show_pic
											? h("img", {
													src: hero.skin || hero.show_pic,
													alt: hero.name ?? "hero",
													loading: "lazy",
													referrerpolicy: "no-referrer",
												})
											: h("span", { class: "gfl2-doll-fallback" }, hero.name ?? "?"),
										hero.grade != null && hero.grade !== ""
											? h(
													"span",
													{ class: "gfl2-grade", "aria-hidden": "true" },
													h(
														"svg",
														{ viewBox: "0 0 34 34" },
														h(
															"text",
															{
																x: "17",
																y: "17",
																"text-anchor": "middle",
																"dominant-baseline": "central",
															},
															String(hero.grade),
														),
													),
												)
											: null,
										h("p", { class: "gfl2-doll-lv" }, `lv.${hero.lv ?? "?"}`),
									].filter(Boolean),
								),
							),
						),
					],
				)
			: null;

	// ---- 战绩：周常（横卷）+ 玩法（网格）----
	const stageCard = (s) => {
		const m = stageMetrics(s);
		return h("div", { class: "gfl2-stage-card", title: stageTitle(s) }, [
			s.item.show_pic
				? h("img", {
						src: s.item.show_pic,
						alt: "",
						loading: "lazy",
						referrerpolicy: "no-referrer",
					})
				: null,
			h("div", { class: "gfl2-stage-cap" }, [
				h("p", { class: "gfl2-stage-name" }, String(s.item.name || s.key)),
				h("div", { class: "gfl2-stage-metric" }, [
					m.chip ? h("span", { class: "gfl2-stage-chip" }, m.chip) : null,
					m.isEmpty
						? h("span", { class: "gfl2-stage-caption gfl2-stage-muted" }, "暂未参与")
						: null,
					m.caption && !m.isEmpty
						? h("span", { class: "gfl2-stage-caption" }, m.caption)
						: null,
				].filter(Boolean)),
			]),
		].filter(Boolean));
	};

	const stageBlock = (label, list, scroll) =>
		h("div", { class: "gfl2-stage-block" }, [
			h("div", { class: "gfl2-stage-group-label" }, `${label} · ${list.length}`),
			h(
				"div",
				{ class: scroll ? "gfl2-stage-scroll custom-scrollbar" : "gfl2-stage-list" },
				list.map(stageCard),
			),
		]);

	// 战绩：整栏折叠（与主题档案一致的 details/summary 写法）
	const nStages =
		allStages.length > 0
			? h("details", { class: "gfl2-stage-details" }, [
					h(
						"summary",
						{ class: "gfl2-stage-summary" },
						`游戏战绩 · ${allStages.length} 项（点击展开）`,
					),
					h(
						"div",
						{ class: "gfl2-stage-body" },
						[
							weekStages.length > 0
								? stageBlock("周常歧路", weekStages, true)
								: null,
							otherStages.length > 0
								? stageBlock("玩法战绩", otherStages, false)
								: null,
						].filter(Boolean),
					),
				])
			: null;

	// ---- 主题档案（折叠）----
	const nThemes =
		themes.length > 0
			? h("details", { class: "gfl2-theme-details" }, [
					h(
						"summary",
						{ class: "gfl2-theme-summary" },
						`主题档案 · ${themes.length} 项（点击展开）`,
					),
					h(
						"div",
						{ class: "gfl2-theme-grid" },
						themes.map((t) =>
							h("div", { class: "gfl2-theme-item" }, [
								t.show_pic
									? h("img", {
											src: t.show_pic,
											alt: `Theme ${t.case_id ?? ""}`,
											loading: "lazy",
											referrerpolicy: "no-referrer",
										})
									: null,
								h(
									"span",
									{ class: "gfl2-theme-pct" },
									`${t.complete_percent ?? "?"}%`,
								),
							].filter(Boolean)),
						),
					),
				])
			: null;

	const linkUrl = cfg.link?.enable === false ? "" : cfg.link?.url || "";
	const RootTag = linkUrl ? "a" : "div";

	return h(
		RootTag,
		{
			class: "card-base not-prose gfl2-embed p-6 md:p-8 mt-6",
			href: linkUrl || undefined,
			target: linkUrl ? "_blank" : undefined,
			rel: linkUrl ? "noopener noreferrer" : undefined,
			title: linkUrl ? cfg.link?.text || undefined : undefined,
		},
		[nHead, nProfile, nHeroes, nStages, nThemes].filter(Boolean),
	);
}
