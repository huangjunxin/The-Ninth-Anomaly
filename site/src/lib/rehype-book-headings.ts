/**
 * Rehype plugin: remove the FIRST h1 from every rendered chapter.
 *
 * Every chapter file opens with `# Chapter N: Title`, which the page chrome
 * (ChapterView) reproduces as the page's own h1. Rendering the body as-is
 * would therefore show the title twice. Chapter files contain exactly one
 * `# ` heading (always at the top), so removing the first h1 is sufficient.
 */
import type { Element, Root } from './hast-types';

function stripFirstH1() {
	return (tree: Root) => {
		const visit = (node: Element | Root): boolean => {
			if (!node.children) return false;
			for (const [i, child] of node.children.entries()) {
				if (child.type === 'element' && child.tagName === 'h1') {
					node.children.splice(i, 1);
					return true;
				}
				if (child.type === 'element' && visit(child as Element)) return true;
			}
			return false;
		};
		visit(tree);
	};
}

export default stripFirstH1;