<script lang="ts">
    import { writable } from 'svelte/store';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
    import AddEvent from '$lib/AddEvent.svelte';
    import { onMount } from 'svelte';
	import app from '$lib/firebase';
	import { getFirestore, collection, query, onSnapshot } from 'firebase/firestore';
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { userProfileStore } from '$lib/userProfileStore';
    import { Button } from 'flowbite-svelte';
    import Fa from 'svelte-fa';
    import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

	// You can add your script here if you need to handle any logic

    const modalStore = getModalStore();

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

<style>
    .accordion-container {
        display: flex;
        flex-wrap: wrap; /* Allow items to wrap to the next line if needed */
    }

    .event-container {
        display: flex;
        align-items: center; /* Align items vertically */
        margin: 0 10px; /* Adjust margin between items */
    }

    .accordion-item {
        flex: 1 1 auto; /* Let items grow and shrink as needed */
        min-width: 300px; /* Set a minimum width for each item */
    }

    .event-time {
        flex-basis: 400px; /* Set a fixed width for the event title column */
        min-width: 300px; /* Set a minimum width for the event title column */
    }

    .event-title {
        min-width: 200px;
    }

    .btn {
        margin-left: auto; /* Push the button to the right */
    }
</style>

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
            <Accordion class="accordion-container">
                {#each $events as event}
                    <div class="event-container">
                        <AccordionItem class="accordion-item" closed>
                            <svelte:fragment slot="lead">
                                <div class="event-time">{event.eventStart} til {event.eventEnd}</div>
                            </svelte:fragment>
                            <svelte:fragment slot="summary">
                                <div class="event-title">{event.title}</div>
                            </svelte:fragment>
                            <svelte:fragment slot="content">{event.description}</svelte:fragment>
                        </AccordionItem>
                        {#if $userProfileStore?.roles.isAdmin}
                            <button type="button" class="btn variant-filled">
                                <Fa icon={faPenToSquare}/>
                            </button>
                            <button type="button" class="btn variant-filled">
                                <Fa icon={faTrash}/>
                            </button>
                        {/if}
                    </div>
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
