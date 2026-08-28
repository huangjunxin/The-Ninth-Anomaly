/**
 * UI strings and locale helpers.
 *
 * The English UI reads the English manuscript; the Cantonese (yue) UI reads
 * the Cantonese translation (books/the-ninth-anomaly/yue/); the Japanese UI
 * reads the Japanese translation (books/the-ninth-anomaly/ja/). Every piece
 * of UI copy lives in this dictionary — nothing is hard-coded in components.
 *
 * Routing: en is the default locale and is unprefixed (`/`, `/chapters/…`),
 * yue lives under `/yue/`, ja under `/ja/`. See astro.config.mjs.
 */

export const locales = ['en', 'yue', 'ja'] as const;
export type Locale = (typeof locales)[number];

/** Shared across locales — it is content, not chrome. */
export const LOGLINE =
	'In a city severed from the very concept of nature, the only man who can see the cat must trade all of his memories to return it to the world.';

/** Japanese rendering of the logline, shown on the Japanese home page. */
export const LOGLINE_JA =
	'自然という概念そのものを断たれた都市で、猫を見ることのできる唯一の男は、すべての記憶と引き換えに、それを世界へ返さなければならない。';

/** Cantonese rendering of the logline, shown on the Cantonese home page. */
export const LOGLINE_YUE =
	'喺一座同『自然』呢個概念徹底斷絕嘅城市入面，唯一睇得見隻貓嘅男人，要用晒自己所有記憶，先可以將佢帶返嚟呢個世界。';

const en = {
	siteTitle: 'The Ninth Anomaly',
	siteTitleYue: '第九異常',
	siteTitleJa: '第九の異常',
	switchTheme: 'Toggle theme',
	langEn: 'EN',
	langYue: '粵文',
	langJa: '日本語',
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

const yue: UiDict = {
	siteTitle: 'The Ninth Anomaly',
	siteTitleYue: '第九異常',
	siteTitleJa: '第九の異常',
	switchTheme: '切換亮暗主題',
	langEn: 'EN',
	langYue: '粵文',
	langJa: '日本語',
	homeKicker: '反烏托邦文學長篇小說',
	homeReadCta: '開始睇',
	homeContents: '目錄',
	homeMeta: '全{n}章 · 約 {words} 字 · 共約 {minutes} 分鐘',
	chapterKicker: '第 {n} 章',
	chapterMeta: '約 {minutes} 分鐘 · {words} 字',
	chapterNum: '{n}',
	chapterTime: '約 {minutes} 分鐘',
	chapterNavPrev: '上一章',
	chapterNavNext: '下一章',
	navAria: '章節導覽',
	sidebarTitle: '目錄',
	tocLink: '目錄',
	skipLink: '跳去正文',
};

const ja: UiDict = {
	siteTitle: 'The Ninth Anomaly',
	siteTitleYue: '第九異常',
	siteTitleJa: '第九の異常',
	switchTheme: 'テーマを切り替える',
	langEn: 'EN',
	langYue: '粵文',
	langJa: '日本語',
	homeKicker: '文学的ディストピア長編小説',
	homeReadCta: '読み始める',
	homeContents: '目次',
	homeMeta: '全{n}章 · 約 {words} 字 · 合計約 {minutes} 分',
	chapterKicker: '第 {n} 章',
	chapterMeta: '約 {minutes} 分 · {words} 字',
	chapterNum: '{n}',
	chapterTime: '約 {minutes} 分',
	chapterNavPrev: '前の章',
	chapterNavNext: '次の章',
	navAria: '章ナビゲーション',
	sidebarTitle: '目次',
	tocLink: '目次',
	skipLink: '本文へスキップ',
};

export const ui: Record<Locale, UiDict> = { en, yue, ja };

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
 * Strip a locale prefix from a pathname, returning the unprefixed (en) path:
 * `/yue/chapters/chapter-01/` → `/chapters/chapter-01/`, `/ja` → `/`.
 */
export function stripLocalePrefix(pathname: string): string {
	const stripped = pathname.replace(/^\/(yue|ja)(?=\/|$)/, '');
	return stripped === '' ? '/' : stripped;
}

/**
 * Translate an unprefixed (en) pathname like `/` or `/chapters/chapter-01/`
 * into the given locale. Pass an already-prefixed path through
 * `stripLocalePrefix` first.
 */
export function localePath(locale: Locale, pathname: string): string {
	if (locale === 'en') return pathname;
	return pathname === '/' ? `/${locale}/` : `/${locale}${pathname}`;
}
