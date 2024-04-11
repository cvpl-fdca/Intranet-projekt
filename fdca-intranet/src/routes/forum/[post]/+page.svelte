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
	import { tocCrawler, TableOfContents } from '@skeletonlabs/skeleton';
	import { AppShell } from '@skeletonlabs/skeleton';

	export let data: PageData;

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


<AppShell>
	<svelte:fragment slot="sidebarLeft">
    <!-- Table of Contents -->
    <div use:tocCrawler={{ mode: 'generate' }} class="w-1/8' mr-4 flex-none overflow-x-hidden overflow-y-auto">
      <h2>Heading 2</h2>
      <p>...</p>
      <h3>Heading 3</h3>
      <p>...</p>
      <!-- Table of contents will be generated here -->
    </div>
	<TableOfContents></TableOfContents>
  </svelte:fragment>

  <slot>
	<div class="container mx-auto my-8">
    <div class="flex justify-center">
      <!-- Post Content -->
      <div class="flex flex-col items-center w-3/4">
        <h1 class="max-w-md px-4 mb-4">{$title}</h1>
        <div class="markdown-container w-[850px] px-4 py-2">
          <MarkdownRenderer {markdownText} />
        </div>
      </div>
    </div>
  </div>
  </slot>
  
</AppShell>

{#if $uid === $authorUID}
  <button on:click={deletePost} type="button" class="btn variant-filled">Delete</button>
  <button type="button" class="btn variant-filled">Edit</button>
{/if}

<h1>{$title}</h1>

<MarkdownRenderer {markdownText} />
