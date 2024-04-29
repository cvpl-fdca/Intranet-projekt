<script lang="ts">
    import { writable } from 'svelte/store';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
    import AddEvent from '$lib/AddEvent.svelte';
    import { onMount } from 'svelte';
	import { getToken } from '$lib/login';
    import MarkdownEditor from '$lib/MarkdownEditor.svelte';
	import MarkdownRenderer from '$lib/MarkdownRenderer.svelte';
	import app from '$lib/firebase';
	import { getFirestore, collection, query, getDocs, onSnapshot } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { ImagePlaceholder } from 'flowbite-svelte';
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader } from 'flowbite-svelte';
	import { AngleDownOutline} from 'flowbite-svelte-icons';
	import { userProfileStore } from '$lib/userProfileStore';

	// You can add your script here if you need to handle any logic

    const modalStore = getModalStore();

    let markdownText = writable('');
    let events = writable([]);

    const addEvent: ModalComponent = { ref: AddEvent };

    const modal: ModalSettings = {
        type: 'component',
        component: addEvent
    };

    let db = getFirestore(app);

    onMount(() => {
		const eventsCollection = collection(db, 'events');
		const eventsQuery = query(eventsCollection);
		const unsubscribe = onSnapshot(
			eventsQuery,
			(querySnapshot) => {
				const eventsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
				events.set(eventsData);
				console.log(eventsData);
			},
			(error) => {
				console.error('Error getting events:', error);
			}
		);
            
	});

    async function openModal() {
        modalStore.trigger(modal);
    }

    $: console.log("EVENTS: ");

    modalStore.close();

</script>

<div class="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Calendar and News/Articles Card -->
    <div>
        <!-- Calendar Card -->
        <div class="card bg-white shadow-md rounded-lg p-4 mb-4">
			<!-- Add margin-bottom here -->
            <h3 class="card-title text-lg font-semibold">Kalender</h3>
            {#if $userProfileStore?.roles.isAdmin}
                <button type="button" class="btn variant-filled" on:click={openModal}>Tilføj event</button>
            {/if}
            <Accordion>
                {#each $events as event}
                    <AccordionItem closed>
                        <svelte:fragment slot="lead">{event.eventStart}</svelte:fragment>
                        <svelte:fragment slot="summary">{event.title}</svelte:fragment>
                        <svelte:fragment slot="content">{event.description}</svelte:fragment>
                    </AccordionItem>
                {/each}
            </Accordion>
        </div>

        <!-- News/Articles Card -->
        <div class="card bg-white shadow-md rounded-lg p-4">
            <h3 class="card-title text-lg font-semibold">Nyheder</h3>
            <p>Here you will put your news content or article summaries</p>
        </div>
    </div>

	<style>
		iframe.discord-widget {
		  transform: scale(2); /* Adjust the scale level as needed */
		  transform-origin: 0 0; /* Adjust as needed */
		}
	  </style>
    <!-- Discord Widget Iframe -->
            <!-- Discord Widget Iframe Here -->
            <iframe title="Discord Widget" src="https://discord.com/widget?id=1072109081105539082&theme=dark" 
                    width="100%" height="400" allowtransparency={true} frameborder="0" 
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts">
            </iframe>
</div>
