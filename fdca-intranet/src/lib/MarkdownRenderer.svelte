<script lang="ts">
	import { marked } from 'marked';
	import { type Writable } from 'svelte/store';
	import SvelteMarkdown from 'svelte-markdown';

	export let markdownText: Writable<string>;

	function handleParsed(event) {
		console.log(event.detail.html);
	}

	const options = {
		gfm: true,
		breaks: true,
		async: true
	};
	
</script>

<div class="card p-2 flex flex-col">
	<SvelteMarkdown source={$markdownText} {options} on:parsed={handleParsed} />
</div>
