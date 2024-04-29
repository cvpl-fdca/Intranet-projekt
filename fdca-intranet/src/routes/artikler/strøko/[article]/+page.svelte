<script lang="ts">
	import MarkdownRenderer from '$lib/MarkdownRenderer.svelte';
	import app from '$lib/firebase';
	import {
		getFirestore,
		collection,
		doc,
		getDoc,
		onSnapshot,
		getDocs,
		type DocumentData
	} from 'firebase/firestore';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { getToken, getUid } from '$lib/login';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { userProfileStore } from '$lib/userProfileStore';
	import { navigate } from 'svelte-routing';
	import {
		isSubscribed,
		subscribeToPage,
		subscribeToPost,
		unsubscribeFromPage,
		unsubscribeFromPost
	} from '$lib/subscribeTo';
	import { faBellSlash, faBell } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import EditArticle from '$lib/EditArticle.svelte';

	export let data: PageData;
	let currentMessage = '';
	console.log(data);
	let userID: string | undefined;
	userProfileStore.subscribe((value) => {
		userID = value?.uid;
	});

	$: console.log('uid', userID);

	let db = getFirestore(app);
	let title = writable('');
	let markdownText = writable('');
	let authorUID = writable('');
	let uid = writable('');
	let authorName = writable('');
	let time = writable('');

	getUid()
		.then((uidValue) => {
			uid.set(uidValue);
		})
		.catch((error) => {
			console.error('Error getting UID:', error);
		});

	const fetchData = async () => {
		console.log('Article: ', data.article);
		const articleRef = doc(db, 'articles/strøko/posts', data.article);
		const unsubscribe = onSnapshot(articleRef, (articleSnap) => {
			if (articleSnap.exists()) {
				const articleData = articleSnap.data();
				markdownText.set(articleData.text);
				title.set(articleData.title);
				authorUID.set(articleData.authorUID);
				authorName.set(articleData.authorName);
				time.set(articleData.time);
				console.log(markdownText);
			}
		});
		return unsubscribe;
	};

	$: console.log('time:', time);

	onMount(() => {
		fetchData();
	});

	const modalStore = getModalStore();
	const editArticle: ModalComponent = { ref: EditArticle };
	let modal: ModalSettings;

	// Reactive statement to update the modal object
	$: {
		modal = {
			type: 'component',
			component: editArticle,
			meta: {
				page: page,
				postId: data.article,
				title: $title,
				markdownText: markdownText
			}
		};
	}
	async function openModal() {
		modalStore.trigger(modal);
	}

	modalStore.close();

	// Reactive statements
	$: console.log($markdownText);
	$: console.log($title);

	// Notifications buttons logic
	let subscribed = false;
	let page = 'strøko';
	let post = data.article;

	$: {
		(async () => {
			subscribed = await isSubscribed(page);
		})();
	}

	async function handleSubscribe() {
		await subscribeToPost(page, post);
		subscribed = await isSubscribed(page, post);
		console.log('subscribed: ' + subscribed);
	}

	async function handleUnsubscribe() {
		await unsubscribeFromPost(page, post);
		subscribed = await isSubscribed(page, post);
		console.log('subscribed: ' + subscribed);
	}
</script>

<div class="relative mt-8 mb-4 px-4">
	<!-- Center-aligned Title, Author, and Date -->
	<div class="text-center mx-auto" style="max-width: 800px;">
		<h1 class="text-4xl font-bold">{$title}</h1>
		<p class="text-sm">{$authorName}</p>
		<p class="text-sm">{new Date($time).toLocaleString()}</p>
		{#if subscribed}
			<button
				type="button"
				class="btn variant-filled"
				on:click={async () => await handleUnsubscribe()}><Fa icon={faBellSlash} /></button
			>
		{:else}
			<button
				type="button"
				class="btn variant-filled"
				on:click={async () => await handleSubscribe()}><Fa icon={faBell} /></button
			>
		{/if}
		{#if $uid === $authorUID}
				<button type="button" class="btn variant-filled" on:click={openModal}>Edit</button>
		{/if}
	</div>
</div>

<!-- Main content area -->
<div class="w-[800px] mx-auto">
	<div>
		<MarkdownRenderer {markdownText} />
	</div>
</div>
