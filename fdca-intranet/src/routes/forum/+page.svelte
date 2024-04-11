<script lang="ts">
	import MarkdownEditor from '$lib/MarkdownEditor.svelte';
	import MarkdownRenderer from '$lib/MarkdownRenderer.svelte';
	import { writable } from 'svelte/store';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import AddForumPost from '$lib/AddForumPost.svelte';
	import app from '$lib/firebase';
	import { getFirestore, collection, query, getDocs, onSnapshot } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ImagePlaceholder } from 'flowbite-svelte';
	let db = getFirestore(app);

	// Subscribe to updates in the 'OpenForum' collection
	onMount(() => {
		const postsCollection = collection(db, 'OpenForum');
		const postsQuery = query(postsCollection);
		const unsubscribe = onSnapshot(
			postsQuery,
			(querySnapshot) => {
				const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
				posts.set(postsData);
				console.log(postsData);
			},
			(error) => {
				console.error('Error getting posts:', error);
			}
		);
	});

	const modalStore = getModalStore();

	let markdownText = writable('');
	let posts = writable([]);

	const addForumPost: ModalComponent = { ref: AddForumPost };

	const modal: ModalSettings = {
		type: 'component',
		component: addForumPost
	};

	async function openModal() {
		modalStore.trigger(modal);
	}

	modalStore.close();
</script>

<h1>Forum!!</h1>

<button type="button" class="btn variant-filled" on:click={openModal}>Add a post</button>

<div class="grid grid-cols-3 gap-4">
	{#each $posts as post}
	<a href={`/forum/${post.id}`} class="card card-hover p-4">
			<h2>{post.title}</h2>
			<p>{post.authorName}</p>
			<p>{new Date(post.time).toLocaleString()}</p>
			<ImagePlaceholder />
	</a>
	{/each}
</div>
