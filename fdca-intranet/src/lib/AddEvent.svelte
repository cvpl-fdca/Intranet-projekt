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
	let text= writable('');
    let start: string;
    let end: string;

	export let parent: SvelteComponent;

	const modalStore = getModalStore();

    async function addEvent(event) {
        try {
			const token = await getToken();
			// Send the formData to the server
			const submissionFormData = new FormData();
			submissionFormData.append('eventStart', start);
            submissionFormData.append('eventEnd', end);
            submissionFormData.append('description', $text);
			submissionFormData.append('title', title);
			const response = await fetch('/api/calendar/addEvent', {
				method: 'POST',
				body: submissionFormData,
				headers: {
					'X-firebase-token': token
				}
			});
      if (response.ok) {
					navigate(`/`);
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
    <input
      type="text"
      bind:value={start}
      class="w-[600px] p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"
      placeholder="Event Start (format: YYYY-MM-dd HH:mm)"
    />
    <input
      type="text"
      bind:value={end}
      class="w-[600px] p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"
      placeholder="Event End (format: YYYY-MM-dd HH:mm)"
    />

    <div class="w-[600px] mb-4">
      <MarkdownEditor {text} />
    </div>

    <button
      on:click={addEvent}
      type="submit"
      class="w-[120px] inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
    >
      Publish Event
    </button>
  </div>
{/if}

