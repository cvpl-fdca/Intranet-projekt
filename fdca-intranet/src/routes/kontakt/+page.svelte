<script lang="ts">
	import { getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import app from '$lib/firebase';
	import { getDocs, collection, onSnapshot, getFirestore, getDoc, doc } from 'firebase/firestore';
	import { onDestroy } from 'svelte';

	interface BoardMember {
		name: string;
		phone: string;
		address: string;
		imageUrl: string;
		additionalText: string;
	}
	interface CommitteeMember {
		name: string;
		phone: string;
		address: string;
		imageUrl: string;
		additionalText: string;
	}

	


	const db = getFirestore(app);
	// Get a reference to the 'groups' collection
	const groupsCollection = collection(db, 'groups');

	// Get a reference to the 'bestyrelse' document
	const bestyrelseDocRef = doc(groupsCollection, 'bestyrelse');

	// Fetch the 'bestyrelse' document
	const bestyrelseDocSnap = getDoc(bestyrelseDocRef);

	// Get the 'members' map
	const members = bestyrelseDocSnap.data().members;

	// Initialize an empty array for the board members
	let boardMembers = [] as BoardMember[];

	// For each member in the 'members' map
	for (const member in members) {
		// Get the user document reference
		const userDocRef = members[member];

		// Fetch the user document
		const userDocSnap = await getDoc(userDocRef);

		// Get the user data
		const userData = userDocSnap.data();

		// Add the user data to the board members array
		boardMembers.push({
			name: userData.name,
			phone: userData.phone,
			address: userData.address,
			imageUrl: userData.imageUrl,
			additionalText: userData.additionalText
		});
	}

	onDestroy(() => {
		unsubscribe();
	});
	const drawerStore = getDrawerStore();

	const drawerKontakt: DrawerSettings = {
		id: 'kontakt-bestyrelse-drawer',
		bgDrawer: 'bg-gray-800 text-white ring-2 ring-gray-700 ring-opacity-100',
		bgBackdrop: 'bg-gray-500 bg-opacity-10',
		padding: 'p-4',
		width: 'w-128',
		height: 'h-128',
		rounded: 'rounded-xl',
		position: 'bottom'
	};

	function openKontaktDrawer() {
		drawerStore.open(drawerKontakt);
	}



	// Example array of committee members
	let committeeMembers: CommitteeMember[] = [
		{
			name: 'Who',
			phone: '123-456-7890',
			address: '123 Main St',
			additionalText: 'Additional info',
			imageUrl: '/path/to/existing/member/image.jpg'
		},
		{
			name: 'Are',
			phone: '123-456-7890',
			address: '123 Main St',
			additionalText: 'Additional info',
			imageUrl: '/path/to/existing/member/image.jpg'
		},
		{
			name: 'You',
			phone: '123-456-7890',
			address: '123 Main St',
			additionalText: 'Additional info',
			imageUrl: '/path/to/existing/member/image.jpg'
		}
	];
</script>

<div class="container mx-auto p-4">
	<!-- Bestyrelse Section -->
	<div class="card bg-blue-800 shadow-md rounded-lg p-4 mb-4">
		<h3 class="text-3xl font-semibold text-white mb-4 text-center">Bestyrelse</h3>
		<div class="text-center mb-4">
			<button class="bg-white text-black py-2 px-8 rounded-full" on:click={openKontaktDrawer}
				>Skriv til Bestyrelse</button
			>
		</div>
		<div class="grid grid-flow-row-dense grid-cols-auto-fit gap-4">
			{#each boardMembers as member, i (i)}
				<div class="card p-4 bg-white rounded shadow-lg">
					<div class="flex flex-col items-center">
						<img
							class="w-24 h-24 rounded-full mb-3"
							src={member.imageUrl}
							alt={`Picture of ${member.name}`}
						/>
						<div class="text-center">
							<h4 class="font-semibold">{member.name}</h4>
							<p>{member.phone}</p>
							<p class="text-sm">{member.address}</p>
							<p class="text-sm">{member.additionalText}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Udvalg Section -->
<div class="container mx-auto p-4">
	<div class="card bg-blue-800 shadow-md rounded-lg p-4 mb-4">
		<h3 class="text-3xl font-semibold text-white mb-4 text-center">Udvalg</h3>
		<div class="grid grid-flow-row-dense grid-cols-auto-fit gap-4">
			{#each committeeMembers as member, i (i)}
				<div class="card p-4 bg-white rounded shadow-lg">
					<div class="flex flex-col items-center">
						<img
							class="w-24 h-24 rounded-full mb-3"
							src={member.imageUrl}
							alt={`Picture of ${member.name}`}
						/>
						<div class="text-center">
							<h4 class="font-semibold">{member.name}</h4>
							<p>{member.phone}</p>
							<p class="text-sm">{member.address}</p>
							<p class="text-sm">{member.additionalText}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.grid-cols-auto-fit {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		grid-gap: 1rem;
	}

	.card {
		transition: background-color 0.3s ease;
		/* If the cards need a fixed width, you can specify it here, and they will maintain the width regardless of screen size */
		/* width: 240px; */
	}
</style>
