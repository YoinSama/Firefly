import type { BackgroundWallpaperConfig } from "@/types/backgroundWallpaper";

export const backgroundWallpaper: BackgroundWallpaperConfig = {
	// 壁纸模式："banner" 横幅壁纸，"fullscreen" 全屏壁纸，"overlay" 覆盖透明，"none" 纯色背景无壁纸
	mode: "fullscreen",
	// 是否启用背景视频播放，配置后将在导航栏显示视频播放按钮
	playerEnable: true,
	/**
	 * 背景图片配置
	 * 图片路径支持三种格式：
	 * 1. public 目录（以 "/" 开头，不优化）："/assets/images/banner.avif"
	 * 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/banner.avif"
	 * 3. 远程 URL："https://example.com/banner.jpg"
	 * 注意：远程URL和public目录的图片不会被优化，请确保图片体积足够小以免影响加载速度
	 *
	 * 建议不要替换d1-d6，m1-m6这些默认示例图片，但你可以删除掉节省空间
	 * 因为以后可能会更换示例图片，导致你自定义的图片被覆盖
	 * 所以建议使用自己的图片的时候命名为其他名称，不要使用d1-d6，m1-m6这些名称
	 *
	 * 如果只使用一张图片或者使用随机图API，推荐直接使用字符串格式：
	 * desktop: "https://t.alcy.cc/pc",   // 随机图API
	 * desktop: "assets/images/DesktopWallpaper/d1.avif", // 单张图片
	 *
	 * mobile: "https://t.alcy.cc/mp", // 随机图API
	 * mobile: "assets/images/MobileWallpaper/m1.avif", // 单张图片
	 *
	 * 支持配置多张图片（数组），每次刷新页面随机显示一张：
	 * desktop: [
	 * "assets/images/DesktopWallpaper/d1.avif",
	 * "assets/images/DesktopWallpaper/d2.avif",
	 * ],
	 *
	 * mobile:[
	 *   "assets/images/MobileWallpaper/m1.avif",
	 *   "assets/images/MobileWallpaper/m2.avif",
	 * ],
	 */
	src: {
		// 桌面背景图片（支持单张或多张随机）
		// desktop: "assets/images/DesktopWallpaper/d1.avif",
		desktop: [
			"assets/images/gf1.avif",
			"assets/images/gf2.avif",
			// "assets/images/DesktopWallpaper/d1.avif",
			// "assets/images/DesktopWallpaper/d2.avif",
			// "assets/images/DesktopWallpaper/d3.avif",
			// "assets/images/DesktopWallpaper/d4.avif",
			// "assets/images/DesktopWallpaper/d5.avif",
			// "assets/images/DesktopWallpaper/d6.avif",
		],
		// 移动背景图片（支持单张或多张随机）
		// mobile: "assets/images/MobileWallpaper/m1.avif",
		mobile: [
			"assets/images/MobileWallpaper/m1.avif",
			"assets/images/MobileWallpaper/m2.avif",
			"assets/images/MobileWallpaper/m3.avif",
			"assets/images/MobileWallpaper/m4.avif",
			"assets/images/MobileWallpaper/m5.avif",
			"assets/images/MobileWallpaper/m6.avif",
		],
		// 背景视频播放地址
		// 支持单个视频路径（字符串）或多个视频循环（数组，参考上面壁纸配置）
		// 支持远程视频URL，本地视频请放在 public/assets/videos/ 目录下
		// playerUrl: "/assets/videos/firefly.mp4",
		playerUrl: "/assets/videos/backgroundVideo.mp4",
	},
	// 横幅壁纸和全屏壁纸共享配置
	common: {
		// 壁纸遮罩暗度，让横幅文字显示更清晰，0-1之间，值越大越暗
		dimOpacity: 0.5,
		// 多视频播放模式："order" 顺序循环，"random" 随机切换（仅当 playerUrl 为数组时生效）
		playerMode: "random",
		// 背景视频默认音量，0-1之间（0 静音，1 最大）
		// 仅作为首次访问的默认值，用户拖动导航栏音量滑块后以 localStorage 中记忆的值为准
		// 修改这里会让"没手动调过音量"的访客跟随新默认值（调过的保留自己的选择）
		playerVolume: 0.01,
		/**
		 * 打开页面时自动播放背景视频
		 * - 直接写 true/false：两端一致
		 * - 分开写：desktop 桌面端 / mobile 移动端（移动端默认关闭，省流量）
		 *
		 * ⚠️ 浏览器自动播放策略：没有用户交互时不允许出声。
		 * 因此自动播放一律"静音起播"，用户第一次点击/滚动/按键后立刻恢复到你设置的音量。
		 * 在 Chrome 里，如果你经常访问本站并播放过媒体（MEI 较高），可能会直接带声自动播放。
		 */
		playerAutoPlay: {
			desktop: true,
			mobile: false,
		},
		// 主页横幅文字
		homeText: {
			// 是否启用主页横幅文字
			enable: true,
			// 主页横幅主标题
			title: "格里芬 S09 辖区",
			// 主页横幅主标题字体大小
			titleSize: "4.5rem",
			// 主页横幅副标题
			subtitle: [
				"为自由开道者，不可令其受困于荆棘。——RO635/慕容雪村 2022冬活 静风点",
				"一片树叶落下，秋天就不会遥远。——哈维尔 2022冬活 静风点",
				"人即像树，枝叶越向往光明的天空，根须越深入阴暗的地底。——M16A1/尼采 终局 2018冬活 塌缩点",
				"你在乱世中独行，又是否热爱过这一切？——第十一章战役：狩猎",
				"荒谬成就世间之美。——RPK16 Cpt.2星辉重明 2021夏活 熵减焓增",
				"唯独死亡不可避免，唯独生命不可辜负。——格雷 Cpt.6混沌终局 2021夏活 熵减焓增",
				"在我之前，已有同路人；在我之后，必有后继者。——指挥官 2022冬活 静风点",
				"我为打破你周遭的囚墙而来，览尽世界，为你沉沦。——第八章战役：火花",
				"凡事都别在事后后悔，真正值得后悔的事，会让你根本没有机会后悔。——K 不在场-实相域 2021冬活 镜像论",
				"“这里沉睡着两个高洁的灵魂。她们用牺牲为世人燃起明烛。”——碑文 Cpt.1净熵减低 2021夏活 熵减焓增",
				"痛苦如此持久，像蜗牛充满耐心地移动。快乐如此短暂，像兔子的尾巴掠过秋天的草原。——鲁戈萨医生/柳德米拉墓志铭 2022夏活 纵向应变",
				"老师问我“如果人生注定是一场徒劳，那么挣扎的意义究竟是什么？”我将用一生，来回答这个问题。——安娜 Cpt.3 2023春活 慢休克",
				"人类终其一生，灵魂都在坠向死亡的途中。就像沙漏里的细沙一样，从一段降落至另一端。——亚瑟·休谟 奢华、宁静与愉悦 2024年特别行动 错构之泉",
				"人心的交易就是欲望的浮沉。——恩布拉（RPK16） 苍白声部 2024年7月特别行动 零电荷",
				"未来属于那些改变它的人，别让恐惧成为你无法实现梦想的理由。——旁白/费迪南德·保时捷 潮土油 2024年8月特别行动 银染显影",
				"真理不惧逆行。——奈乐 破裂 2024年8月特别行动 银染显影",
				"现在大家早就忘记了什么是理想，成年人之间似乎早就只剩下利益了。——被遗忘的誓言 2024年12月特别行动 卷积核",
				"强者行其所能为，弱者忍其所必受。——灰烬天堂/《伯罗奔尼撒战争史》 修昔底德 2025年剧情活动 虚粒子对",
				"彗星袭月，白虹贯日。你从来不缺少尊严与勇气，为了理想，不论前方是何等的荆棘坎途，你都义无反顾。——丹德莱 回忆录“无尽的黑暗彼方” 最终章 零态潮汐",
			],
			// 主页横幅副标题字体大小
			subtitleSize: "1rem",
			typewriter: {
				// 是否启用打字机效果
				// 打字机开启 → 循环/随机显示所有副标题（由 shuffle 控制）
				// 打字机关闭 → 每次刷新随机显示一条副标题
				enable: true,
				// 打字机开启时是否随机播放所有副标题（true=随机洗牌顺序播放，false=顺序循环）
				shuffle: true,
				// 打字速度（毫秒）
				speed: 100,
				// 删除速度（毫秒）
				deleteSpeed: 10,
				// 完全显示后的暂停时间（毫秒）
				pauseTime: 2000,
			},
			// 是否显示标题下方的链接图标
			linksEnable: true,
			// 首页横幅标题下方的链接图标（可选，支持 showName 显示文字）
			// 图标支持 Iconify 格式：fa7-brands:github、fa7-solid:envelope、mdi:rss 等
			links: [
				{
					name: "GitHub",
					icon: "fa7-brands:github",
					url: "https://github.com/YoinSama",
					showName: true,
				},
				{
					name: "QQ",
					icon: "fa7-brands:qq",
					url: "https://qm.qq.com/q/i779rkKWoo",
					showName: true,
				},
				{
					name: "Bilibili",
					icon: "simple-icons:bilibili",
					url: "https://space.bilibili.com/34481368",
					showName: true,
				},
				{
					name: "RSS",
					icon: "fa7-solid:rss",
					url: "/rss/",
					showName: true,
				},
			],
		},
		// 壁纸轮播配置，横幅壁纸和全屏壁纸共享，仅在配置多张图片时生效
		carousel: {
			// 是否启用壁纸轮播；关闭时保持每次刷新随机显示一张
			enable: true,
			// 轮播切换间隔（毫秒）
			interval: 5000,
			// 过渡效果: 'fade' 渐变 | 'zoom' 缩放 | 'slide' 滑动 | 'kenburns' 旋转木马
			transitionEffect: "fade",
		},
		// 水波纹动画效果配置，开启会影响页面性能，增加内存占用，请根据自己的喜好开启
		waves: {
			enable: {
				// 桌面端是否启用水波纹动画效果
				desktop: true,
				// 移动端是否启用水波纹动画效果
				mobile: false,
			},
		},
		// 渐变过渡效果配置，当水波纹关闭时自动启用，提供壁纸底部到背景色的平滑过渡
		gradient: {
			enable: {
				// 桌面端是否启用渐变过渡
				desktop: true,
				// 移动端是否启用渐变过渡
				mobile: true,
			},
			// 渐变高度
			height: "10%",
		},
	},
	// Banner模式特有配置
	banner: {
		// 图片位置
		// 支持所有CSS object-position值，如: 'top', 'center', 'bottom', 'left top', 'right bottom', '25% 75%', '10px 20px'..
		// 如果不知道怎么配置百分百之类的配置，推荐直接使用：'center'居中，'top'顶部居中，'bottom' 底部居中，'left'左侧居中，'right'右侧居中
		position: "0% 20%",
		// 文章横幅信息："description" 显示描述，"meta" 显示日期、字数和阅读时长
		postInfo: {
			mode: "description",
		},
		// 导航栏配置
		navbar: {
			// 导航栏透明模式："semi" 半透明，"semifull" 动态透明，"none" 纯色不透明
			transparentMode: "semi",
			// 毛玻璃模糊度，0 即关闭导航栏的毛玻璃
			// 注意：导航栏子菜单与浮动面板始终保留毛玻璃，模糊度跟随此项但有最小值
			blur: 12,
		},
	},
	// 覆盖透明覆盖模式特有配置
	overlay: {
		// 层级，确保壁纸在背景层
		zIndex: -1,
		// 壁纸透明度
		opacity: 0.8,
		// 背景模糊度
		blur: 10,
		// 卡片透明度，0-1之间，值越小越透明
		cardOpacity: 0.8,
	},
	// 全屏壁纸模式特有配置
	// 壁纸模糊度(blur)、卡片透明度(cardOpacity)、层级(zIndex) 复用上方 overlay 模式的配置；
	// 背景透明度(opacity)不适用（全屏壁纸不透明）；导航栏透明模式由 fullscreen.navbar.transparentMode 控制，脱离 banner 的 navbar 配置
	fullscreen: {
		// 布局模式："classic" 经典文档流全屏壁纸，"hero" 固定全屏首屏壁纸
		layout: "classic",
		// 图片位置
		position: "center",
		// 全屏壁纸模式的导航栏配置
		navbar: {
			// 导航栏透明模式："semi" 半透明，"semifull" 动态透明（仅首页顶部透明、下滑玻璃化；非首页均跟卡片半透明）
			transparentMode: "semifull",
			// 导航栏毛玻璃模糊度，0 即关闭（玻璃态生效）
			blur: 0,
		},
		// 首页下滑时壁纸模糊渐变开关（从 0 渐变为 overlay.blur 的最大模糊）
		// 关闭后该设备上全屏壁纸保持清晰（首页与非首页都不模糊），设置面板的模糊度滑块也会隐藏
		blurRamp: {
			enable: {
				// 桌面端是否启用模糊渐变
				desktop: false,
				// 移动端是否启用模糊渐变
				mobile: true,
			},
		},
	},
};
