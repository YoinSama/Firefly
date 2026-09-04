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
	notConfigured: string;
	fetchFailed: string;
}
