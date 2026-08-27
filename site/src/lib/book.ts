import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Chapter = CollectionEntry<'chapters'>;

/** Reading speed used for the per-chapter time estimates (English prose). */
export const WORDS_PER_MINUTE = 230;

const ROMAN = [
	'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
	'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII',
];

/** Convert 1–18 into the chapter numerals shown in the UI. */
export function roman(n: number): string {
	return ROMAN[n - 1] ?? String(n);
}

/** Every chapter opens with `# Chapter N: Title` — the only guaranteed marker. */
export function parseChapterHeading(body: string): { number: number; title: string } | null {
	const match = body.match(/^#\s+Chapter\s+(\d+):\s*(.+)$/m);
	if (!match) return null;
	return { number: Number.parseInt(match[1], 10), title: match[2].trim() };
}

export function wordCount(body: string): number {
	return body.trim().split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(words: number): number {
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export interface ChapterMeta {
	slug: string;
	number: number;
	roman: string;
	title: string;
	words: number;
	minutes: number;
}

export function chapterMeta(chapter: Chapter): ChapterMeta {
	const heading = parseChapterHeading(chapter.body ?? '');
	const words = wordCount(chapter.body ?? '');
	return {
		slug: chapter.id,
		number: heading?.number ?? 0,
		roman: roman(heading?.number ?? 0),
		title: heading?.title ?? chapter.id,
		words,
		minutes: readingMinutes(words),
	};
}

export interface ChapterNavLink {
	slug: string;
	title: string;
}

/** All chapters, ordered by their declared chapter number. */
export async function getChapters(): Promise<Chapter[]> {
	const chapters = await getCollection('chapters');
	return chapters
		.map((c) => ({ c, meta: chapterMeta(c) }))
		.sort((a, b) => a.meta.number - b.meta.number)
		.map((x) => x.c);
}