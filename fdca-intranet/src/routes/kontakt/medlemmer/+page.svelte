<script lang="ts">
	import { onMount } from 'svelte';
	import { memberStore } from '$lib/memberStore';
	import type { User } from '$lib/user';

	let members: User[] = [];
	$: {
		members = $memberStore;
	}
</script>

{#each members as member}
	<div class="card p4">
		<p>{member.details.fullName}</p>
		<p>{member.details.email?.fdca}</p>
		<p>{member.details.phone?.private}</p>
	</div>
{/each}
