import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The manuscript lives outside the site root, in the repository's books/
// directory. `base` accepts an absolute file URL, so we anchor it to this
// file's own location rather than relying on the build working directory.
const chapters = defineCollection({
	loader: glob({
		pattern: 'chapter-*.md',
		base: new URL('../../books/the-ninth-anomaly/chapters/', import.meta.url),
	}),
	schema: z.object({}),
});

export const collections = { chapters };