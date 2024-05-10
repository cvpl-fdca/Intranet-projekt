<script lang="ts">
    import { writable } from 'svelte/store';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
    import AddEvent from '$lib/AddEvent.svelte';
    import EditEvent from '$lib/EditEvent.svelte';
    import { onMount } from 'svelte';
	import app from '$lib/firebase';
	import { getFirestore, collection, query, onSnapshot } from 'firebase/firestore';
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { userProfileStore } from '$lib/userProfileStore';
    import Fa from 'svelte-fa';
    import { faPenToSquare, faTrash, faPalette } from '@fortawesome/free-solid-svg-icons';
	import { getToken } from '$lib/login';
	import { navigate } from 'svelte-routing';
    import ColorEvent from '$lib/ColorEvent.svelte';
	import type { stringify } from 'querystring';

	// You can add your script here if you need to handle any logic

    const modalStore = getModalStore();

    let events = writable([]);

    let db = getFirestore(app);

    onMount(() => {
		const eventsCollection = collection(db, 'events');
		const eventsQuery = query(eventsCollection);
		const unsubscribe = onSnapshot(
			eventsQuery,
			(querySnapshot) => {
				const eventsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
				events.set(eventsData);
			},
			(error) => {
				console.error('Error getting events:', error);
			}
		);
            
	});

    const addEvent: ModalComponent = { ref: AddEvent };
    const addModal: ModalSettings = {
        type: 'component',
        component: addEvent
    };
    async function openAddModal() {
        modalStore.trigger(addModal);
    }

    const editEvent: ModalComponent = { ref: EditEvent };
    let editModal: ModalSettings;
    async function openEditModal(event) {
        editModal = {
            type: 'component',
            component: editEvent,
            meta: {
                eventId: event.id,
            },
        };
        modalStore.trigger(editModal);
    }

    async function deleteEvent(eventId: string) {
        if (confirm('Are you sure you want to delete this post?')) {
			try {
				const token = await getToken();
				// Append the postID to the URL as a parameter
                const submissionFormData = new FormData();
                submissionFormData.append('eventId', eventId);
				const response = await fetch(`/api/calendar/deleteEvent`, {
					method: 'DELETE',
                    body: submissionFormData,
					headers: {
						'X-firebase-token': token,
					}
				});

				// If the post was successfully deleted, navigate to the forum
				if (response.ok) {
					navigate('/');
					location.reload();
				}
			} catch (error) {
				console.error('Error:', error.message);
			}
		}
    }

    const colorEvent: ModalComponent = { ref: ColorEvent };
    let colorModal: ModalSettings;
    async function editColor(eventId: string) {
        colorModal = {
            type: 'component',
            component: colorEvent,
            meta: {
                eventId: eventId,
            },
        }
        modalStore.trigger(colorModal);
    }

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
        min-width: 250px; /* Set a minimum width for the event title column */
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
            {#if $userProfileStore?.roles.isAdmin || $userProfileStore?.roles.projects.karkom || $userProfileStore?.roles.projects.socsam || $userProfileStore?.roles.projects.strøko}
                <button type="button" class="btn variant-filled" on:click={openAddModal}>Tilføj event</button>
            {/if}
            <Accordion class="accordion-container">
                {#each $events as event}
                    <div class="event-container">
                        <AccordionItem class="accordion-item" closed>
                            <svelte:fragment slot="lead">
                                <div class="event-time" style="color: {event.color}">{event.eventStart} til {event.eventEnd}</div>
                            </svelte:fragment>
                            <svelte:fragment slot="summary">
                                <div class="event-title" style="color: {event.color}">{event.title}</div>
                            </svelte:fragment>
                            <svelte:fragment slot="content">{event.description}</svelte:fragment>
                        </AccordionItem>
                        {#if $userProfileStore?.roles.isAdmin || $userProfileStore?.roles.projects.karkom || $userProfileStore?.roles.projects.socsam || $userProfileStore?.roles.projects.strøko}
                            <button type="button" class="btn variant-filled" on:click={openEditModal(event)}>
                                <Fa icon={faPenToSquare}/>
                            </button>
                            {#if $userProfileStore?.roles.isAdmin}
                                <button type="button" class="btn variant-filled" on:click={editColor(event.id)}>
                                    <Fa icon={faPalette}/>
                                </button>
                            {/if}
                            <button type="button" class="btn variant-filled" on:click={deleteEvent(event.id)}>
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
