<script lang="ts">
	import { writable } from 'svelte/store';
	import { getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import app from '$lib/firebase';
	import { getDocs, collection, onSnapshot, getFirestore, getDoc, doc } from 'firebase/firestore';
	import { onDestroy } from 'svelte';
	import { User } from '$lib/user';
	import type { DocumentReference } from '@firebase/firestore-types';
	import { memberStore } from '$lib/memberStore';

	const db = getFirestore(app);
	const groupsCollection = collection(db, 'groups');
	const committees = writable([]); // Create a writable store for the committees
	const bestyrelse = writable({ name: '', members: [] }); // Create a separate store for the "bestyrelse" committee

	$: console.log($committees);
	$: console.log($bestyrelse);
	// Define the Committee interface
	interface GroupMember {
		role: string,
		userRef: DocumentReference,
	}
	interface Committee {
		name: string;
		members: GroupMember[];
	}
	let allMembers: User[] = [];
			$: {
				allMembers = $memberStore;
			};

	// Subscribe to the 'groups' collection
	const unsubscribe = onSnapshot(groupsCollection, async (snapshot) => {
		let newCommittees: Committee[] = [];

		// For each document in the 'groups' collection
		for (const doc of snapshot.docs) {
			let committee: Committee = {
				name: doc.id,
				members: []
			};

			// Get the 'members' map
			const members = doc.data().members;

			// For each member in the 'members' map
			for (const member in members) {
				// Get the user document reference
				const userDocRef = members[member];

				// Fetch the user document
				const userDocSnap = await getDoc(userDocRef.userRef);

				// Get the user data
				const userData = userDocSnap.data() as User;

				committee.members.push(userData);
			}

			// If the committee is "bestyrelse", update the "bestyrelse" store
			if (committee.name === 'bestyrelse') {
				bestyrelse.set(committee);
			} else {
				if(committee.name === 'strøko') {
					committee.name = 'Strategi / Økonomi';
				}
				else if(committee.name === 'karkom') {
					committee.name = 'Karriere- / Kompetenceudvikling';
				}
				else if(committee.name === 'socsam') {
					committee.name = 'Socialt sammenhold';
				}
				newCommittees.push(committee);
			}
		}

		// Update the committees store
		committees.set(newCommittees);
	});

	onDestroy(() => {
		// Unsubscribe from the 'groups' collection when the component is destroyed
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
</script>

<div class="container mx-auto p-4"></div>
<!-- Bestyrelse Section -->
<div class="card bg-blue-800 shadow-md rounded-lg p-4 mb-4">
	<h3 class="text-3xl font-semibold text-white mb-4 text-center">Bestyrelsen</h3>
	<div class="text-center mb-4">
		<button class="bg-white text-black py-2 px-8 rounded-full" on:click={openKontaktDrawer}
			>Skriv til Bestyrelse</button
		>
	</div>
	<div
		class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center justify-content-center"
	>
		{#each $bestyrelse.members as member, i (i)}
			<div class="card p-4 bg-white rounded shadow-lg animate-fade-in">
				<div class="flex flex-col items-center">
					<img
						class="w-24 h-24 rounded-full mb-3"
						src={member.details.imageUrl}
						alt={`Picture of ${member.details.fullName}`}
					/>
					<div class="text-center">
						<h4 class="font-semibold">{member.details.fullName}</h4>
						<p>{member.details.phone.private}</p>
						<p class="text-sm">{member.details.email.fdca}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

{#each $committees as committee}
	<div class="container mx-auto p-4">
		<div class="card bg-blue-800 shadow-md rounded-lg p-4 mb-4">
			<h3 class="text-3xl font-semibold text-white mb-4 text-center">{committee.name}</h3>
			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center justify-content-center"
			>
				{#each committee.members as member, i (i)}
					<div
						class="card p-4 bg-white rounded shadow-lg animate-fade-in"
						style="animation-delay: {i * 100}ms;"
					>
						<div class="flex flex-col items-center">
							<img
								class="w-24 h-24 rounded-full mb-3"
								src={member.details.imageUrl}
								alt={`Picture of ${member.details.fullName}`}
							/>
							<div class="text-center">
								<h4 class="font-semibold">{member.details.fullName}</h4>
								<p>{member.details.phone.private}</p>
								<p class="text-sm">{member.details.email.fdca}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/each}
