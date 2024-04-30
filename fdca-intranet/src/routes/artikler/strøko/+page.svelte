<script lang="ts">
	// You can add your script here if you need to handle any logic
	import {
		getFirestore,
		collection,
		doc,
		getDoc,
		onSnapshot,
		getDocs,
		query,
		type DocumentData
	} from 'firebase/firestore';
	import { writable } from 'svelte/store';
	import app from '$lib/firebase';
	import { getToken, getUid } from '$lib/login';
	import { userProfileStore } from '$lib/userProfileStore';
	import type { User } from '$lib/user';
	import { onMount } from 'svelte';
	import AddArticle from '$lib/AddArticle.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { isSubscribed, subscribeToPage, unsubscribeFromPage } from '$lib/subscribeTo';
	import Fa from 'svelte-fa';
	import {faBell, faBellSlash} from '@fortawesome/free-solid-svg-icons';


let db = getFirestore(app);

onMount(() => {
		const articleCollection = collection(db, 'articles/strøko/posts');
		const articlesQuery = query(articleCollection);
		const unsubscribe = onSnapshot(
			articlesQuery,
			(querySnapshot) => {
				const articlesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
				articles.set(articlesData);
				console.log(articlesData);
			},
			(error) => {
				console.error('Error getting articles:', error);
			}
		);
	});;

const modalStore = getModalStore();
let markdownText = writable('');
let articles = writable([]);

const addArticle: ModalComponent = { ref: AddArticle };

const modal: ModalSettings = {
	type: 'component',
	component: addArticle,
	meta: {
		project: 'strøko', 
	}
};

async function openModal() {
	modalStore.trigger(modal);
}
modalStore.close();

	// Notifications buttons logic
	let subscribed = false;
	let page = 'strøko';
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

<div class="center-content"> 
	<h1>Strategi/Økonomi</h1>
	{#if $userProfileStore?.roles.projects.strøko}
	<button type="button" class="btn variant-filled" on:click={openModal}>Add an article</button>
	{/if}
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
</div>

<div class="grid grid-cols-3 gap-4">
	{#each $articles as article}
	<a href= {`/artikler/strøko/${article.id}`} class="card card-hover p-4">
		<h2>{article.title}</h2>
		<p>{article.authorName}</p>
		<p>{new Date(article.time).toLocaleString()}</p>
	</a>
	{/each}
</div>


