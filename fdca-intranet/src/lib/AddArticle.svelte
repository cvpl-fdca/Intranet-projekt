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
	import { navigate } from 'svelte-routing';

	let userDoc;
	userProfileStore.subscribe((value) => {
		userDoc = value as User;
		console.log('userdoc' + userDoc);
	});

	const token = getToken();
	let title: string;
	let text = writable('');

	export let parent: SvelteComponent;
	console.log(parent);
	const modalStore = getModalStore();
	

	async function addArticle() {
		try {
			const project: string = $modalStore[0]?.meta?.project;
			const token = await getToken();
			const submissionFormData = new FormData();
			submissionFormData.append('text', $text);
			submissionFormData.append('title', title);
			submissionFormData.append('project', project);
			const response = await fetch('/api/artikler/createArticle', {
				method: 'POST',
				body: submissionFormData,
				headers: {
					'X-firebase-token': token
				}
			})
			if (response.ok) {
					navigate(`/artikler/${project}`);
					location.reload();
			}
		} catch (error) {
			console.error('Error:', error.message);
		}
	}

</script>

{#if $modalStore[0]}
  <div class="flex flex-col items-center justify-center">
    <input
      type="text"
      bind:value={title}
      class="w-[600px] p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"
      placeholder="Title"
    />

    <div class="w-[600px] mb-4">
      <MarkdownEditor {text} />
    </div>

    <button
      on:click={addArticle}
      type="submit"
      class="w-[120px] inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
    >
      Publish post
    </button>
  </div>
{/if}

