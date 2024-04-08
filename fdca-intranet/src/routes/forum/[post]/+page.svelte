<script lang="ts">
	import MarkdownRenderer from '$lib/MarkdownRenderer.svelte';
	import app from '$lib/firebase';
	import { getFirestore, collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
    import { getIdToken } from 'firebase/auth';
	import { getToken } from '$lib/login';

	export let data: PageData;

	console.log(data);

	let db = getFirestore(app);
	let title = writable('');
	let markdownText = writable('');

	const fetchData = async () => {
		const postRef = doc(db, 'OpenForum', data.post);
		const unsubscribe = onSnapshot(postRef, (postSnap) => {
			if (postSnap.exists()) {
				const postData = postSnap.data();
				markdownText.set(postData.text);
				title.set(postData.title);
				console.log(markdownText);
			}
		});
		return unsubscribe;
	};


    

</script>

{#if token.uid === data.post.authorUID}
    <button type="button" class="btn variant-filled">Edit</button>
{/if}

<h1>{$title}</h1>

<MarkdownRenderer {markdownText} />
