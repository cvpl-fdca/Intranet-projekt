<script lang="ts">
	import MarkdownRenderer from '$lib/MarkdownRenderer.svelte';
	import app from '$lib/firebase';
	import { getFirestore, collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { getToken, getUid } from '$lib/login';

	export let data: PageData;

	console.log(data);

	let db = getFirestore(app);
	let title = writable('');
	let markdownText = writable('');
	let authorUID = writable('');
	let uid = writable('');

	getUid()
		.then((uidValue) => {
			uid.set(uidValue);
		})
		.catch((error) => {
			console.error('Error getting UID:', error);
		});


	const fetchData = async () => {
		const postRef = doc(db, 'OpenForum', data.post);
		const unsubscribe = onSnapshot(postRef, (postSnap) => {
			if (postSnap.exists()) {
				const postData = postSnap.data();
				markdownText.set(postData.text);
				title.set(postData.title);
				authorUID.set(postData.authorUID); // Set the author's UID
				console.log(markdownText);
			}
		});
		return unsubscribe;
	};

	onMount(() => {
		fetchData();
	});

	
	async function deletePost() {
    try {
      const token = await getToken();
      // Append the postID to the URL as a parameter
      const response = await fetch(`/api/forum/deleteForumPost/${data.post}`, {
        method: 'DELETE',
        headers: {
          'X-firebase-token': token
        }
      });
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

</script>

{#if $uid === $authorUID}
  <button on:click={deletePost} type="button" class="btn variant-filled">Delete</button>
  <button type="button" class="btn variant-filled">Edit</button>
{/if}

<h1>{$title}</h1>

<MarkdownRenderer {markdownText} />
