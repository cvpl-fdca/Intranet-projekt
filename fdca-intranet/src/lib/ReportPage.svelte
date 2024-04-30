<script lang="ts">
	import { Fa } from 'svelte-fa';
	import { faFlag, faTimes } from '@fortawesome/free-solid-svg-icons';
	import { getToken } from './login';
	let isOpen = false;
	let reportReason = '';

	async function reportPage() {
		const url = window.location.href;
		const title = document.title;

		try {
			const token = await getToken();
			const submissionFormData = new FormData();
			submissionFormData.append(
				'body',
				'Reported page: ' + url + '\n' + 'Title: ' + title + '\n' + 'Reason:' + reportReason
			);
			submissionFormData.append('type', 'report');
			submissionFormData.append('subject', 'Page reported');

			const response = await fetch(`/api/sendEmail`, {
				method: 'POST',
				headers: {
					'X-firebase-token': token
				},
				body: submissionFormData
			});

			// Close the drawer after submitting the report
			isOpen = false;
			reportReason = '';
		} catch (error) {
			console.error('Error:', error.message);
		}
	}
</script>

<button on:click={() => (isOpen = !isOpen)} class="report-button btn btn-primary variant-filled-warning">
	<Fa icon={faFlag} />
</button>

{#if isOpen}
	<div class="report-drawer card">
		<button on:click={() => (isOpen = false)} class="close-button">
			<Fa icon={faTimes} class="bg-red" />
		</button>
		<textarea class="textarea" bind:value={reportReason} placeholder="Enter report reason..."
		></textarea>
		<button on:click={reportPage} class="btn btn-primary">Submit</button>
	</div>
{/if}

<style>
    .report-drawer {
        position: fixed;
        right: 0;
        top: 0;
        width: 300px;
        height: 100%;
        padding: 20px;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }
    .report-button {
        position: fixed;
        right: -10px;
        bottom: 10px;
        cursor: pointer;
        z-index: 1000;
    }
    .close-button {
        position: absolute;
        right: 10px;
        top: 10px;
        background: none;
        border: none;
        cursor: pointer;
    }
</style>
