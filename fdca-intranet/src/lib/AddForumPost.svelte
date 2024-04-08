<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import app from '$lib/firebase';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	
	//import firestore
	import { getFirestore, collection, addDoc } from 'firebase/firestore';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import MarkdownEditor from '$lib/MarkdownEditor.svelte';
	import { getToken } from '$lib/login';
	import { userProfileStore } from './userProfileStore';
	import type { User } from './user';
	import { writable } from 'svelte/store';

	let userDoc;
	userProfileStore.subscribe((value) => {
		userDoc = value as User;
		console.log('userdoc' + userDoc);
	});

	const token = getToken();
	let title: string;
	let text = writable('');

	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	async function addPost() {
		try {
			const token = await getToken();
			// Send the formData to the server
			const submissionFormData = new FormData();
			submissionFormData.append('text', $text);
			submissionFormData.append('title', title);
			const response = await fetch('/api/forum/createForumPost', {
				method: 'POST',
				body: submissionFormData,
				headers: {
					'X-firebase-token': token
				}
			});
		} catch (error) {
			console.error('Error:', error.message);
		}
	}

</script>

{#if $modalStore[0]}
	<input
		type="text"
		bind:value={title}
		class="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
		placeholder="Title"
	/>

	<MarkdownEditor {text} />
	<button
		on:click={addPost}
		type="submit"
		class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
	>
		Publish post
	</button>
{/if}
