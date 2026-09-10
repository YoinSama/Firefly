import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题，留空则走i18n默认标题
	title: "辖区公告",

	// 公告内容（建议 40~70 字，太长侧边栏难看）
	content: "刚入职S09 辖区，还在陆续折腾中。少前2游戏资料卡已上线，欢迎来踩个脚印。",

	// 是否允许用户关闭公告
	closable: false,

	link: {
		// 启用链接
		enable: true,
		// 链接文本
		text: "更多",
		// 链接 URL
		url: "/about/",
		// 内部链接
		external: false,
	},
};
