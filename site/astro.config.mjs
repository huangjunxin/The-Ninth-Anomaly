// @ts-check
import { defineConfig } from 'astro/config';
import stripFirstH1 from './src/lib/rehype-book-headings';

// https://astro.build/config
export default defineConfig({
	markdown: {
		// Chapter files open with the `# Chapter N: Title` line; the page chrome
		// renders that as its own h1, so the first h1 is removed from the body.
		rehypePlugins: [stripFirstH1],
	},
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'yue', 'ja'],
		routing: {
			prefixDefaultLocale: false, // en at `/`, yue at `/yue/`, ja at `/ja/`
			redirectToDefaultLocale: false, // client-side auto-selection instead (BaseLayout head script)
		},
	},
});