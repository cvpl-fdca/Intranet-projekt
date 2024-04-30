<script lang="ts">
	import { onMount, type SvelteComponent } from 'svelte';
	import app from '$lib/firebase';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';

	//import firestore
	import { getFirestore, collection, addDoc } from 'firebase/firestore';
	import { getModalStore } from '@skeletonlabs/skeleton';
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
	let color: string = $modalStore[0]?.meta?.color;

	let eventId = $modalStore[0]?.meta?.eventId;
	console.log('eventId: ' + eventId);
	export let parent: SvelteComponent;

	async function colorEvent() {
		try {
			const token = await getToken();
			// Send the formData to the server
			const submissionFormData = new FormData();
			submissionFormData.append('color', color);
            submissionFormData.append('eventId', eventId);
			let url = '/api/calendar/colorEvent';
			const response = await fetch(url, {
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
	<div class="grid md:grid-cols-2 gap-4">
		<!-- Column 1 for title, MarkdownEditor, and Save event button -->
		<div class="space-y-4">
			<input
				type="text"
				bind:value={color}
				class="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
				placeholder="Color"
			/>
			<button
				on:click={colorEvent}
				type="submit"
				class="w-[102px] inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
			>
				Save event
			</button>
		</div>
	</div>
{/if}
