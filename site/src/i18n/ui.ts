/**
 * UI strings and locale helpers.
 *
 * The manuscript itself is always the English original; i18n only affects the
 * site chrome (header, nav, hero copy, TOC labels, …). Every piece of UI copy
 * lives in this dictionary — nothing is hard-coded in components.
 *
 * Routing: en is the default locale and is unprefixed (`/`, `/chapters/…`),
 * zh lives under `/zh/` (`/zh/`, `/zh/chapters/…`). See astro.config.mjs.
 */

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

/** Shared across locales — it is content, not chrome. */
export const LOGLINE =
	'In a city severed from the very concept of nature, the only man who can see the cat must trade all of his memories to return it to the world.';

const en = {
	siteTitle: 'The Ninth Anomaly',
	siteTitleZh: '第九类异体',
	switchTheme: 'Toggle theme',
	langEn: 'EN',
	langZh: '中文',
	homeKicker: 'A Literary Dystopian Novel',
	homeReadCta: 'Start Reading',
	homeContents: 'Contents',
	homeMeta: '{n} chapters · approx. {words} words · {minutes} min total',
	chapterKicker: 'Chapter {roman}',
	chapterMeta: '{minutes} min read · {words} words',
	chapterNum: '{roman}',
	chapterTime: '{minutes} min read',
	chapterNavPrev: 'Previous',
	chapterNavNext: 'Next',
	navAria: 'Chapter navigation',
	sidebarTitle: 'Contents',
	tocLink: 'Contents',
	skipLink: 'Skip to content',
};

type UiDict = typeof en;

const zh: UiDict = {
	siteTitle: 'The Ninth Anomaly',
	siteTitleZh: '第九类异体',
	switchTheme: '切换亮暗主题',
	langEn: 'EN',
	langZh: '中文',
	homeKicker: '反乌托邦科幻长篇小说',
	homeReadCta: '开始阅读',
	homeContents: '目录',
	homeMeta: '{n} 章 · 约 {words} 词 · 共约 {minutes} 分钟',
	chapterKicker: '第 {n} 章',
	chapterMeta: '约 {minutes} 分钟 · {words} 词',
	chapterNum: '{n}',
	chapterTime: '约 {minutes} 分钟',
	chapterNavPrev: '上一章',
	chapterNavNext: '下一章',
	navAria: '章节导航',
	sidebarTitle: '目录',
	tocLink: '目录',
	skipLink: '跳到正文',
};

export const ui: Record<Locale, UiDict> = { en, zh };

export type UiKey = keyof UiDict;

/** Look up a UI string, substituting `{var}` placeholders if vars are given. */
export function t(locale: Locale, key: UiKey, vars?: Record<string, string | number>): string {
	let s: string = ui[locale][key] ?? ui.en[key] ?? key;
	if (vars) {
		for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
	}
	return s;
}

/**
 * Translate a pathname into the given locale. `pathname` is an unprefixed
 * (en) path like `/` or `/chapters/chapter-01/`.
 */
export function localePath(locale: Locale, pathname: string): string {
	if (locale === 'en') return pathname;
	if (pathname === '/') return '/zh/';
	return pathname.startsWith('/zh') ? pathname : `/zh${pathname}`;
}

/** The same current page in the *other* locale (for the switcher link). */
export function otherLocaleHref(locale: Locale, pathname: string): string {
	if (locale === 'en') return localePath('zh', pathname);
	// Strip the /zh prefix from e.g. `/zh/chapters/chapter-01/` → `/chapters/chapter-01/`
	const stripped = pathname.replace(/^\/zh(\/|$)/, '/');
	return stripped === '' ? '/' : stripped;
}