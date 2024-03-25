<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getToken } from './login';
	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { User } from './user';
	import { browser } from '$app/environment';
	import { get } from 'svelte/store';

	export let parent: SvelteComponent;
	export let userDoc: User;
	$: console.log(userDoc);

	const modalStore = getModalStore();

	// Form Data
	const formData = {
		name: userDoc.details.fullName,
		telPrivate: userDoc.details.phone.private,
		telWork: userDoc.details.phone.work,
		emailFDCA: userDoc.details.email.fdca,
		emailPrivate: userDoc.details.email.private,
		emailWork: userDoc.details.email.work,
		discordName: userDoc.details.discordName
	};

	// Function to submit form data to the server
    async function onFormSubmit(): Promise<void> {
        if (browser) {
            // Create a new FormData instance
            const submissionFormData = new FormData();
            // Populate it with the current state of the reactive formData object
            for (const key in formData) {
                if (formData.hasOwnProperty(key)) {
                    submissionFormData.append(key, (formData as any)[key] as string);
                }
            }

            try {
                const token = await getToken();
                // Send the formData to the server
                const response = await fetch('/api/updateUserDetails', {
                    method: 'POST',
                    body: submissionFormData,
                    headers: {
                        'X-firebase-token': token
                    }
                });

                // The rest of your try-catch-finally block remains the same
            } catch (error) {
                console.error('Error:', error.message);
            } finally {
                modalStore.close();
            }
        }
    }

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>Indtast information om dig selv</header>
		<article>
			Information omkring dig indtastes frivilligt. Ved at opgive din indformation her giver du FDCA
			tilladelse til at behandle din personlige data i henhold til gældende lovgivning. Din data vil
			blive delt med andre medlemmer på intrasitet, hvis du vælger at opgive den.
		</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Navn</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="indtast navn..." />
			</label>

			<label class="label">
				<span>Privat tlf</span>
				<input
					class="input"
					type="tel"
					bind:value={formData.telPrivate}
					placeholder="Indtast privatnummer..."
				/>
			</label>

			<label class="label">
				<span>Arbejds tlf</span>
				<input
					class="input"
					type="tel"
					bind:value={formData.telWork}
					placeholder="Indtast arbejdsnummer..."
				/>
			</label>

			<label class="label">
				<span>Privat email</span>
				<input
					class="input"
					type="email"
					bind:value={formData.emailPrivate}
					placeholder={userDoc.details.email.private}
				/>
			</label>

			<label class="label">
				<span>Arbejds email</span>
				<input class="input" type="email" bind:value={formData.emailWork} />
			</label>

			<label class="label">
				<span>FDCA email</span>
				<input class="input" type="email" bind:value={formData.emailFDCA} />
			</label>

			<label class="label">
				<span>Discord Brugernavn</span>
				<input
					class="input"
					type="text"
					bind:value={formData.discordName}
					placeholder="Enter Discord name..."
				/>
			</label>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
		</footer>
	</div>
{/if}
