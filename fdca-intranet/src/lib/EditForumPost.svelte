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
	import { writable, type Writable } from 'svelte/store';
	import MarkdownRenderer from './MarkdownRenderer.svelte';

	let userDoc;
	userProfileStore.subscribe((value) => {
		userDoc = value as User;
		console.log('userdoc' + userDoc);
	});

	const modalStore = getModalStore();

	const token = getToken();
	let title: string = $modalStore[0]?.meta?.title;
	let text: Writable<string> = $modalStore[0].meta.markdownText;
	let nonReactiveText = $text; // This is a non-reactive copy of text
	let textCopy: Writable<string> = writable(nonReactiveText); // this is a reactive copy of text, that doesnt bubble the reactivity up to the parent component

	let postId = $modalStore[0].meta.postId;
	console.log('postId: ' + postId);
	export let parent: SvelteComponent;

	async function editPost() {
		try {
			const token = await getToken();
			// Send the formData to the server
			const submissionFormData = new FormData();
			submissionFormData.append('text', $textCopy);
			submissionFormData.append('title', title);
			submissionFormData.append('postId', postId);
			let url = '/api/forum/editForumPost/' + postId;
			const response = await fetch(url, {
				method: 'PATCH',
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
	<div class="grid md:grid-cols-2 gap-4">
		<!-- Column 1 for title, MarkdownEditor, and Save post button -->
		<div class="space-y-4">
			<input
				type="text"
				bind:value={title}
				class="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
				placeholder="Title"
			/>

			<MarkdownEditor text={textCopy} />

			<button
				on:click={editPost}
				type="submit"
				class="w-[102px] inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
			>
				Save post
			</button>
		</div>

		<!-- Column 2 for MarkdownRenderer -->
		<div>
			<div class="card p-4 w-[500px]">
				<MarkdownRenderer markdownText={textCopy} />
			</div>
		</div>
	</div>
{/if}
