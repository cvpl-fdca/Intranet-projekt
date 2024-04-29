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
	import Fa from 'svelte-fa';
	import {faBell, faBellSlash} from '@fortawesome/free-solid-svg-icons';
	import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader } from 'flowbite-svelte';
	import { AngleDownOutline } from 'flowbite-svelte-icons';
	import { isSubscribed, subscribeToPage, unsubscribeFromPage } from '$lib/subscribeTo';

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

	let selected = 'Sort';
	const selectItem = (item) => (selected = item);

	// Notifications buttons logic
	let subscribed = false;
	let page = 'forum';
	$: {
		(async () => {
			subscribed = await isSubscribed(page);
		})();
	}

	async function handleSubscribe() {
		await subscribeToPage(page);
		subscribed = await isSubscribed(page);
	}

	async function handleUnsubscribe() {
		await unsubscribeFromPage(page);
		subscribed = await isSubscribed(page);
	}
	
</script>

<div class="center-content">
	<h1>Forum</h1>
	<button type="button" class="btn variant-filled" on:click={openModal}>Add a post</button>
	{#if subscribed}
		<button
			type="button"
			class="btn variant-filled"
			on:click={async () => await handleUnsubscribe()}><Fa icon={faBellSlash}/></button
		>
	{:else}
		<button
			type="button"
			class="btn variant-filled"
			on:click={async () => await handleSubscribe()}><Fa icon={faBell}/></button
		>
	{/if}

	<button type="button" class="btn">{selected}<AngleDownOutline /></button>
	<Dropdown>
		<DropdownItem on:click={() => selectItem('Newest')}>Newest</DropdownItem>
		<DropdownItem on:click={() => selectItem('Oldest')}>Oldest</DropdownItem>
		<DropdownItem on:click={() => selectItem('Best')}>Best</DropdownItem>
	</Dropdown>
</div>

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

<style>
	.center-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		height: 200px;
	}
</style>
