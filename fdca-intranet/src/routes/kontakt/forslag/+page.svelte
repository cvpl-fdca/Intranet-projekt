<script lang=ts>
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import app from '$lib/firebase';
	import { getFirestore, collection, query, getDocs, onSnapshot } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ImagePlaceholder } from 'flowbite-svelte';
	import { AngleDownOutline} from 'flowbite-svelte-icons';
	import AddForslagPost from '$lib/AddForslagPost.svelte';
	import { getToken, getUid } from '$lib/login';
	
	
		const modalStore = getModalStore();
	
		let db = getFirestore(app);
	
		// Subscribe to updates in the 'OpenForslag' collection
		onMount(() => {
			const postsCollection = collection(db, 'OpenForslag');
			const postsQuery = query(postsCollection);
			const unsubscribe = onSnapshot(
				postsQuery,
				(querySnapshot) => {
					const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
					posts.set(postsData);
					console.log(postsData);
				},
				(error) => {
					console.error('Error getting posts:', error);
				}
			);
		});
	
		let markdownText = writable('');
		let posts = writable([]);
	
		const addForslagPost: ModalComponent = { ref: AddForslagPost };
	
		const modal: ModalSettings = {
			type: 'component',
			component: addForslagPost
		};
	
		async function openModal() {
			modalStore.trigger(modal);
		}
	
		modalStore.close();
	
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
		<h1>Forslag</h1>
		<button type="button" class="btn variant-filled" on:click={openModal}>Tilføj Forslag</button>
	</div>
	
	<div class="grid grid-cols-3 gap-4">
		{#each $posts as post}
		  <div class="card card-hover p-4">
			<a href={`/kontakt/forslag/${post.id}`}>
			  <h2>{post.title}</h2>
			  <p>{post.authorName}</p>
			  <p>{new Date(post.time).toLocaleString()}</p>
			  <ImagePlaceholder />
			</a>
		  </div>
		{/each}
	  </div>
	
	
	