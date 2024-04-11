<script lang="ts">
	import { marked } from 'marked';
	import { type Writable } from 'svelte/store';
	import SvelteMarkdown from 'svelte-markdown'; // https://github.com/pablo-abc/svelte-markdown
	import CodeBlock from './MarkdownComponents/CodeBlock.svelte';
	import Table from './MarkdownComponents/Table.svelte';
	import TableHead from './MarkdownComponents/TableHead.svelte';
	import TableBody from './MarkdownComponents/TableBody.svelte';
	import TableRow from './MarkdownComponents/TableRow.svelte';
	import TableHeadCell from './MarkdownComponents/TableHead.svelte';
	import TableBodyCell from './MarkdownComponents/TableBody.svelte';
	import TableCell from './MarkdownComponents/TableCell.svelte';

	export let markdownText: Writable<string>;

	function handleParsed(event: any) {
		console.log(event.detail.html);
	}

	const options = {
		gfm: true,
		breaks: true,
		async: true
	};

	const renderers = {
		code: CodeBlock,
		table: Table,
		tablehead: TableHead,
		tablebody: TableBody,
		tablerow: TableRow,
		tablecell: TableCell,
		
	};
</script>

<div class="card p-2 flex flex-col">
	<SvelteMarkdown source={$markdownText} {options} {renderers} on:parsed={handleParsed} />
</div>
