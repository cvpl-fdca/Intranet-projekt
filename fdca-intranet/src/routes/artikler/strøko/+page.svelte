<script lang="ts">
	// You can add your script here if you need to handle any logic
	import {
		getFirestore,
		collection,
		doc,
		getDoc,
		onSnapshot,
		getDocs,
		type DocumentData
	} from 'firebase/firestore';
	import { writable } from 'svelte/store';
	import app from '$lib/firebase';
	import { getToken, getUid } from '$lib/login';
	import { userProfileStore } from '$lib/userProfileStore';
	import type { User } from '$lib/user';
	import AddArticle from '$lib/AddArticle.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';


let db = getFirestore(app);

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

</script>

<h1>Strategi/Økonomi</h1>

<button type="button" class="btn variant-filled" on:click={openModal}>Add a post</button>
