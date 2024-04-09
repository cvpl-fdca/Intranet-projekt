<script lang="ts">
	import MarkdownRenderer from '$lib/MarkdownRenderer.svelte';
	import app from '$lib/firebase';
	import { getFirestore, collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { getToken, getUid } from '$lib/login';
	import EditForumPost from '$lib/EditForumPost.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	export let data: PageData;

	console.log(data);

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
		const postRef = doc(db, 'OpenForum', data.post);
		const unsubscribe = onSnapshot(postRef, (postSnap) => {
			if (postSnap.exists()) {
				const postData = postSnap.data();
				markdownText.set(postData.text);
				title.set(postData.title);
				authorUID.set(postData.authorUID);
				authorName.set(postData.authorName);
				time.set(postData.time);
				console.log(markdownText);
			}
		});
		return unsubscribe;
	};

	onMount(() => {
		fetchData();
	});

	const modalStore = getModalStore();
	const editForumPost: ModalComponent = { ref: EditForumPost };

	// Reactive statements
	$: console.log($markdownText);
	$: console.log($title);

	let modal: ModalSettings;

	// Reactive statement to update the modal object
	$: {
		modal = {
			type: 'component',
			component: editForumPost,
			meta: {
				postId: data.post,
				title: $title,
				markdownText: markdownText
			}
		};
	}

	async function openModal() {
		modalStore.trigger(modal);
	}

	modalStore.close();

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
	<button type="button" class="btn variant-filled" on:click={openModal}>Edit</button>
{/if}

<h1>{$title}</h1>
<p>{$authorName}</p>
<p>{new Date($time).toLocaleString()}</p>

<MarkdownRenderer {markdownText} />
