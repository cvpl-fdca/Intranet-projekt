<script lang="ts">
	import { onMount } from 'svelte';
	import LoginModal from './LoginModal.svelte';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
  
	const modalStore = getModalStore();
	const auth = getAuth();
  
	const modalComponent: ModalComponent = { ref: LoginModal };
  
	const modal: ModalSettings = {
	  type: 'component',
	  component: modalComponent,
	};
  
	onMount(() => {
	  // Listen for authentication state changes
	  onAuthStateChanged(auth, (user) => {
		if (user) {
		  // User is signed in, clear the modal
		  modalStore.clear();
		} else {
		  // No user is signed in, trigger the modal
		  modalStore.trigger(modal);
		}
	  });
	});
  </script>
  