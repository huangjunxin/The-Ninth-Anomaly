import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

export type Chapter = CollectionEntry<'chapters'> | CollectionEntry<'chaptersJa'>;

/** Reading speed used for the per-chapter time estimates (English prose). */
export const WORDS_PER_MINUTE = 230;
/** Reading speed for the Japanese translation (characters per minute). */
export const JA_CHARS_PER_MINUTE = 500;

const ROMAN = [
	'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
	'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII',
];

/** Convert 1–18 into the chapter numerals shown in the UI. */
export function roman(n: number): string {
	return ROMAN[n - 1] ?? String(n);
}

/**
 * English chapters open with `# Chapter N: Title`; the Japanese translation
 * uses `# 第N章：タイトル` (fullwidth colon). Either is the guaranteed marker.
 */
export function parseChapterHeading(body: string): { number: number; title: string } | null {
	const match =
		body.match(/^#\s+Chapter\s+(\d+):\s*(.+)$/m) ??
		body.match(/^#\s+第\s*(\d+)\s*章[：:]\s*(.+)$/m);
	if (!match) return null;
	return { number: Number.parseInt(match[1], 10), title: match[2].trim() };
}

/**
 * Text size used for the reading-time estimate. English prose counts
 * whitespace-separated words; Japanese has no spaces, so count CJK
 * characters (kanji + kana) instead.
 */
export function textCount(body: string, locale: Locale = 'en'): number {
	if (locale === 'ja') {
		return (body.match(/[぀-ヿ㐀-䶿一-鿿豈-﫿]/g) ?? []).length;
	}
	return body.trim().split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(count: number, locale: Locale = 'en'): number {
	const perMinute = locale === 'ja' ? JA_CHARS_PER_MINUTE : WORDS_PER_MINUTE;
	return Math.max(1, Math.round(count / perMinute));
}

export interface ChapterMeta {
	slug: string;
	number: number;
	roman: string;
	title: string;
	/** English: word count. Japanese: character count. */
	words: number;
	minutes: number;
}

export function chapterMeta(chapter: Chapter, locale: Locale = 'en'): ChapterMeta {
	const heading = parseChapterHeading(chapter.body ?? '');
	const words = textCount(chapter.body ?? '', locale);
	return {
		slug: chapter.id,
		number: heading?.number ?? 0,
		roman: roman(heading?.number ?? 0),
		title: heading?.title ?? chapter.id,
		words,
		minutes: readingMinutes(words, locale),
	};
}

export interface ChapterNavLink {
	slug: string;
	title: string;
}

/**
 * All chapters, ordered by their declared chapter number. The 'ja' locale
 * reads the translated manuscript; 'en' and 'zh' both read the English
 * original (the zh UI localizes the chrome only).
 */
export async function getChapters(locale: Locale = 'en'): Promise<Chapter[]> {
	const chapters = await getCollection(locale === 'ja' ? 'chaptersJa' : 'chapters');
	return chapters
		.map((c) => ({ c, meta: chapterMeta(c, locale) }))
		.sort((a, b) => a.meta.number - b.meta.number)
		.map((x) => x.c);
}
