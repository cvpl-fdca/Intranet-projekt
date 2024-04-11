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
	import EditForumPost from '$lib/EditForumPost.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { userProfileStore } from '$lib/userProfileStore';
	import { navigate } from 'svelte-routing';

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
	let comments = writable<DocumentData[]>([]);

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

		// Subscribe to comments subcollection
		const commentsRef = collection(postRef, 'comments');

		onSnapshot(commentsRef, (snapshot) => {
			let commentsData = snapshot.docs.map((doc) => {
				let data = doc.data();
				if (typeof data.time === 'string') {
					data.time = new Date(data.time); // Parse string to Date
				}
				return data;
			});

			commentsData.sort((a, b) => b.time - a.time); // Sort comments by time
			comments.set(commentsData);
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
		if (confirm('Are you sure you want to delete this post?')) {
			try {
				const token = await getToken();
				// Append the postID to the URL as a parameter
				const response = await fetch(`/api/forum/deleteForumPost/${data.post}`, {
					method: 'DELETE',
					headers: {
						'X-firebase-token': token
					}
				});
	
				// If the post was successfully deleted, navigate to the forum
				if (response.ok) {
					navigate('/forum');
					location.reload();
				}
			} catch (error) {
				console.error('Error:', error.message);
			}
		}
	}
	async function addComment() {
		try {
			const token = await getToken();
			const submissionFormData = new FormData();
			submissionFormData.append('text', currentMessage);
			// Append the postID to the URL as a parameter
			const response = await fetch(`/api/forum/addComment/${data.post}`, {
				method: 'POST',
				headers: {
					'X-firebase-token': token
				},
				body: submissionFormData
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


<div class="grid gap-1 h-auto w-auto p-4">
    <div class="bg-surface-500/30 p-4 overflow-y-auto ">
        {#each $comments as comment}
            <div class="grid gap-2">
                <div class={`card p-4  rounded-tl-none space-y-2 my-2 ${userID === comment.authorUID ? 'variant-ghost' : 'variant-soft'}`}>
                    <!-- Added 'my-2' class for margin -->
                    <header class="flex justify-between items-center">
                        <p class="font-bold">{comment.authorName}</p>
                        <small class="opacity-50">{new Date(comment.time).toLocaleString()}</small>
                    </header>
                    <p>{comment.text}</p>
                </div>
            </div>
        {/each}
    </div>
	<div class="bg-surface-500/30 p-4">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
			<button class="input-group-shim">+</button>
			<textarea
				bind:value={currentMessage}
				class="bg-transparent border-0 ring-0"
				name="prompt"
				id="prompt"
				placeholder="Write a message..."
				rows="1"
			/>
			<button class="variant-filled-primary" on:click={addComment}>Send</button>
		</div>
	</div>
</div>
