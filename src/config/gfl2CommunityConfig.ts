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

	/**
	 * 次级模块显示开关（默认全开；改成 false 即不渲染该分区）。
	 * 注意：这里只认本地配置，不接官方接口 user_info 里的
	 * show_hero / show_stage / show_theme（那是玩家在官方社区设的隐私开关），
	 * 避免「我明明开了却不显示」的困惑。
	 */
	modules: {
		heroes: true,
		stages: true,
		themes: true,
	},

	/**
	 * 点击卡片跳转到官方社区资料页。
	 * 原分享链接里那串 back_url 是「站内返回历史」（/threadInfo?id=133233 →
	 * /search?search_word=余音Yoin），只影响在官方站内点返回的落点，直达用不上，已去掉。
	 */
	link: {
		enable: true,
		url: "https://gf2-bbs.exiliumgf.com/m/otherData?id=18736",
		text: "数据来源于《少女前线2：追放》官方社区",
		external: true,
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
		// 卡片底部「数据来源」文案；未配置时回退到上面的 link.text，两者留一个即可
		sourceFrom: "数据来源于《少女前线2：追放》官方社区",
		notConfigured: "GFL2 社区资料未启用",
		fetchFailed: "暂无法获取游戏数据（源站可能不可达或 API Key 无效）",
	},
};
