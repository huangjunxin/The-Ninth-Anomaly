/**
 * Minimal structural types for the hast tree nodes this plugin touches.
 * (The `hast` types package is not a dependency of this project.)
 */

export interface Root {
	type: 'root';
	children: HNode[];
}

export interface Element {
	type: 'element';
	tagName: string;
	properties: Record<string, unknown>;
	children: HNode[];
}

export type HNode = Element | { type: 'text'; value: string } | { type: 'comment'; value: string } | Element;

export type RootOrElement = Root | Element;