import type { Gfl2CommunityConfig } from "../types/gfl2CommunityConfig";

/**
 * GFL2 社区资料展示配置
 *
 * 使用方式（仿 musicConfig.meting）：
 *   1) 把 api.apiKey 填入你刚在 gf2bbsapi 管理页创建的 API Key；
 *   2) 或在本地 .env / CF Pages 构建环境变量里设 GFL2_API_KEY，二选一；
 *   3) pnpm dev 自动拉取（astro:server:start 集成触发）；
 *   4) pnpm build 在 astro build 之前跑一次脚本，数据落 src/constants/gfl2-community.json。
 *
 * fetch 失败（源站挂 / 网络不通）只会输出空结构 + warn，**不会阻塞构建**，博客仍能发布。
 */
export const gfl2CommunityConfig: Gfl2CommunityConfig = {
	enable: true,
	showOnAbout: true,

	api: {
		base: "http://8.134.199.98:8787",
		apiKey: "", // 留空则尝试读取 process.env.GFL2_API_KEY
	},

	limits: {
		heroCount: 8,
	},

	i18n: {
		nickname: "游戏昵称",
		level: "指挥官等级",
		achievement: "成就",
		activeDays: "活跃天数",
		heroCount: "已收集人形",
		skinCount: "已收集涂装",
		weaponCount: "已收集武器",
		mainStage: "主线进度",
		guild: "所属公会",
		heroesTitle: "常用人形",
		stagesTitle: "玩法战绩",
		themesTitle: "主题活动",
		lastUpdated: "数据更新于",
		notConfigured: "GFL2 社区资料未启用",
		fetchFailed: "暂无法获取游戏数据（源站可能不可达或 API Key 无效）",
	},
};
