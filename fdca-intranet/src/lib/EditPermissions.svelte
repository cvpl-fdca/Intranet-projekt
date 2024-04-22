<script lang="ts">
	import { getModalStore, SlideToggle } from '@skeletonlabs/skeleton';
    import { createEventDispatcher, SvelteComponent} from 'svelte';

    let isAdmin: boolean;
    let karkom: boolean;
    let karkom_role: string;
    let strøko: boolean;
    let strøko_role: string;
    let socsam: boolean;
    let socsam_role: string;

    export let parent: SvelteComponent;
    const modalStore = getModalStore();

    function submitChanges() {

    }

    function cancel() {

    }
    
    function toggleAdmin() {
        isAdmin = !isAdmin;
    }
    function toggleKarkom() {
        karkom = !karkom;
    }
    function toggleStrøko() {
        strøko = !strøko;
    }
    function toggleSocsam() {
        socsam = !socsam;
    }
    

</script>

{#if $modalStore[0]}
  <div class="flex flex-col items-center justify-center">
    <div class="toggle-container" style="display: flex; align-items: center; margin-bottom: 10px;">
        <span class="toggle-label" style="margin-right: 10px;">IsAdmin?</span>
        <SlideToggle name="isAdminToggle" checked={isAdmin} active="bg-primary-500" on:change={toggleAdmin} />
    </div>
    <div class="toggle-container" style="display: flex; align-items: center; margin-bottom: 10px;">
        <span class="toggle-label" style="margin-right: 10px;">Karriere/kommunikation?</span>
        <SlideToggle name="karkomToggle" checked={karkom} active="bg-primary-500" on:change={toggleKarkom} />
    </div>
    {#if karkom}
    <input
      type="string"
      bind:value={karkom_role}
      class="w-[600px] p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"
      placeholder="Karriere/kompetence rolle"
    />
    {/if}
    <div class="toggle-container" style="display: flex; align-items: center; margin-bottom: 10px;">
        <span class="toggle-label" style="margin-right: 10px;">Strategi/Økonomi?</span>
        <SlideToggle name="strøkoToggle" checked={strøko} active="bg-primary-500" on:change={toggleStrøko} />
    </div>
    {#if strøko}
    <input
      type="string"
      bind:value={strøko_role}
      class="w-[600px] p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"
      placeholder="Strategi/Økonomi rolle"
    />
    {/if}
    <div class="toggle-container" style="display: flex; align-items: center; margin-bottom: 10px;">
        <span class="toggle-label" style="margin-right: 10px;">Socialt Sammenhold?</span>
        <SlideToggle name="socsamToggle" checked={socsam} active="bg-primary-500" on:change={toggleSocsam} />
    </div>
    {#if socsam}
    <input
      type="string"
      bind:value={strøko_role}
      class="w-[600px] p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"
      placeholder="Socialt sammenhold rolle"
    />
    {/if}

    
    
<div class="modal-footer">
    <button
      on:click={submitChanges}
      type="submit"
      class="w-[120px] inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
    >
      Confirm
    </button>
    <button
      on:click={cancel}
      class="w-[120px] inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
    >
      Cancel
    </button>
</div>
    </div>
{/if}