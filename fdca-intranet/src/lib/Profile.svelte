<script lang="ts">
	import { User } from './user';
	import { userProfileStore } from '$lib/userProfileStore';

	import { onDestroy, onMount } from 'svelte';
	import { getAuth, onAuthStateChanged, signOut, type User as firebaseUser } from 'firebase/auth';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import EditUserDataModal from './EditUserDataModal.svelte';
	const auth = getAuth();
	let userDoc: User;
	let modalComponent: ModalComponent;

	const unsubscribe = userProfileStore.subscribe((value) => {
		userDoc = value as User;
		console.log('userdoc' + userDoc);
	});

	onDestroy(unsubscribe);
	let user: firebaseUser | null;
	onMount(() => {
		console.log(auth.currentUser); // null (initially)
		onAuthStateChanged(auth, (firebaseUser) => {
			user = firebaseUser; // Update the user variable with the current user
			modalComponent = {
				ref: EditUserDataModal,
				props: { userDoc: userDoc }
			};
		});
	});

	function handleLogout() {
		signOut(auth)
			.then(() => {
				// Sign-out successful.
				console.log('User signed out');
			})
			.catch((error) => {
				// An error happened.
				console.error('Sign out error', error);
			});
	}

	const modalStore = getModalStore();
	function handleEdit() {
		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent
		};
		modalStore.trigger(modal);
	}
</script>

<div
	id="example-3"
	class="drawer bg-gray-800 text-white ring-2 ring-gray-700 ring-opacity-100 w-64 p-4 rounded-xl flex flex-col relative h-full"
>
	<div class="flex flex-col justify-between h-full pb-16">
		<div class="text-center p-2">
			<img
				src={user?.photoURL || 'lib/images/fdca_logo.svg'}
				alt=""
				class="h-16 w-16 rounded-full mx-auto"
			/>
			<div class="font-semibold my-4">Name: {userDoc?.details?.fullName}</div>
			<div class="font-semibold">{user?.displayName}</div>
		</div>
		<!-- Menu Items -->
		<ul class="text-sm">
			<!-- Divider Line -->
			<hr class="my-2 border-t border-gray-600 h-px bg-gray-600 w-5/7 mx-auto" />
			<!-- Phone -->
			<li class="p-2 rounded-md font-semibold">Phone</li>
			{#each Object.entries(userDoc?.details?.phone || {}) as [key, value]}
				{#if value}
					<li class="hover:bg-gray-700 p-2 rounded-md font-semibold">{key}: {value}</li>
				{/if}
			{/each}

			<!-- Divider Line -->
			<hr class="my-2 border-t border-gray-600 h-px bg-gray-600 w-5/7 mx-auto" />
			<!-- Mail -->
			<li class="p-2 rounded-md font-semibold">Emails</li>
			{#each Object.entries(userDoc?.details?.email || {}) as [key, value]}
				{#if value}
					<li class="hover:bg-gray-700 p-2 rounded-md font-semibold">{key}: {value}</li>
				{/if}
			{/each}

			<!-- Divider Line -->
			<hr class="my-2 border-t border-gray-600 h-px bg-gray-600 w-5/7 mx-auto" />
			<!-- Menu Items -->
			<li class="p-2 rounded-md font-semibold">Discord User</li>
			<li class="hover:bg-gray-700 p-2 rounded-md font-semibold">{userDoc?.details.discordName}</li>
			<!-- Divider Line -->
			<hr class="my-2 border-t border-gray-600 h-px bg-gray-600 w-5/7 mx-auto" />
		</ul>
	</div>

	<!-- Buttons -->
	<div class="absolute bottom-2.5 left-1 right-1 p-2 flex justify-between">
		<button
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			on:click={handleEdit}
		>
			Edit
		</button>
		<button
			class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
			on:click={handleLogout}
		>
			Logout
		</button>
	</div>
</div>
