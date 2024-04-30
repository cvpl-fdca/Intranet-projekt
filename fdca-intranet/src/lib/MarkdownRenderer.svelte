<script lang="ts">
	import { onMount } from 'svelte';
	import { type Writable } from 'svelte/store';
	import SvelteMarkdown from 'svelte-markdown';
	import CodeBlock from './MarkdownComponents/CodeBlock.svelte';
	import Table from './MarkdownComponents/Table.svelte';
	import TableHead from './MarkdownComponents/TableHead.svelte';
	import TableBody from './MarkdownComponents/TableBody.svelte';
	import TableRow from './MarkdownComponents/TableRow.svelte';
	import TableCell from './MarkdownComponents/TableCell.svelte';

	// The markdownText prop is a writable store that holds the markdown content
	export let markdownText: Writable<string>;

	let DOMPurify: any;

	// Run this code when the component is mounted
	onMount(async () => {
		// Import the DOMPurify library dynamically
		const module = await import('dompurify');
		DOMPurify = module.default;
	});

	// Configuration for DOMPurify
	const config = {
		ALLOWED_TAGS: [
			'a',
			'b',
			'blockquote',
			'code',
			'del',
			'dd',
			'dl',
			'dt',
			'em',
			'h1',
			'h2',
			'h3',
			'i',
			'img',
			'kbd',
			'li',
			'ol',
			'p',
			'pre',
			's',
			'sup',
			'sub',
			'strong',
			'strike',
			'ul',
			'br',
			'hr',
			'table',
			'thead',
			'caption',
			'tbody',
			'tr',
			'th',
			'td',
			'codeblock',
			'code'
		],
		ALLOWED_ATTR: [
			'href',
			'title',
			'src',
			'width',
			'height',
			'alt',
			'cite',
			'class',
			'style',
			'align',
			'valign',
			'span',
			'colspan',
			'header',
			'scope'
		],
		ADD_ATTR: ['target'] // To safely open links in a new tab
	};

	/**
	 * Sanitizes the HTML content of a node using DOMPurify.
	 * @param {HTMLElement} node - The HTML node to sanitize.
	 * @returns {object} - An object with an `update` method to re-sanitize the content.
	 */
	function sanitizeHTML(node: HTMLElement) {
		if (DOMPurify) {
			node.innerHTML = DOMPurify.sanitize(node.innerHTML, config);
		}
		return {
			update() {
				if (DOMPurify) {
					node.innerHTML = DOMPurify.sanitize(node.innerHTML, config);
				}
			}
		};
	}

	/**
	 * Handles the 'parsed' event emitted by SvelteMarkdown.
	 * @param {object} event - The event object containing the parsed HTML.
	 */
	function handleParsed(event: any) {
		console.log(event.detail.html);
	}

	const options = {
		gfm: true,
		breaks: true,
		async: true,
		sanitize: true
	};

	const renderers = {
		code: CodeBlock,
		table: Table,
		tablehead: TableHead,
		tablebody: TableBody,
		tablerow: TableRow,
		tablecell: TableCell
	};
	
</script>

<div class="card p-2 flex flex-col">
	<div use:sanitizeHTML>
		<!-- Render the markdown content using SvelteMarkdown -->
		<SvelteMarkdown source={$markdownText} {options} {renderers} on:parsed={handleParsed} />
	</div>
</div>
