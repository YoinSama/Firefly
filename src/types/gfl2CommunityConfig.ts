/**
 * GFL2 社区资料展示的配置类型。
 * 与 musicConfig.meting 子对象风格保持一致：用户自填 base + apiKey，
 * 拉取层（脚本/集成）在构建/dev 时拉取并存入 src/constants/gfl2-community.json。
 */
export interface Gfl2CommunityConfig {
	/** 全局开关：false 时脚本跳过拉取，组件整体不渲染 */
	enable: boolean;

	/** 是否在 about 页底部显示游戏资料卡片 */
	showOnAbout: boolean;

	/** 后端 API 配置（仿 musicConfig.meting.api / .auth 子对象） */
	api: {
		/** gf2bbsapi 基础地址，例如 http://8.134.199.98:8787 */
		base: string;
		/** 多 API Key 中的某一把 key（管理页可创建/查询/删除） */
		apiKey: string;
	};

	/** 拉取与展示限制 */
	limits?: {
		/** 最多展示多少个人形（默认 8；接口本就返回恰 8） */
		heroCount?: number;
	};

	/**
	 * 次级模块（人形图鉴 / 战绩档案 / 主题档案）显示开关。
	 * 全部可选，默认开启：判断一律用 `!== false`，将来不写这个字段也不会误关。
	 */
	modules?: {
		/** 人形图鉴，默认展示 */
		heroes?: boolean;
		/** 战绩档案，默认展示 */
		stages?: boolean;
		/** 主题档案，默认展示 */
		themes?: boolean;
	};

	/**
	 * 点击卡片跳转（官方社区资料页）。
	 * URL 只在这里配一份，组件统一读取，不在任何组件里硬编码。
	 */
	link?: {
		/** 是否启用跳转，默认 true；url 为空时自动不生效 */
		enable?: boolean;
		/** 跳转地址，例如 https://gf2-bbs.exiliumgf.com/m/otherData?id=18736 */
		url?: string;
		/** 跳转文案（同时作为链接的 title 提示；正式环境「数据来源」行也复用它） */
		text?: string;
		/** 新窗口打开，默认 true → target="_blank" + rel="noopener noreferrer" */
		external?: boolean;
	};

	/** 文案（不配置则用组件内置默认） */
	i18n?: Partial<Gfl2CommunityI18n>;
}

export interface Gfl2CommunityI18n {
	nickname: string;
	level: string;
	achievement: string;
	activeDays: string;
	heroCount: string;
	skinCount: string;
	weaponCount: string;
	mainStage: string;
	guild: string;
	heroesTitle: string;
	stagesTitle: string;
	themesTitle: string;
	lastUpdated: string;
	/** 正式环境底部展示的「数据来源」文案（link.text 未配置时的回退） */
	sourceFrom: string;
	notConfigured: string;
	fetchFailed: string;
}
