<script lang="ts">
    import { faGoogle } from '@fortawesome/free-brands-svg-icons';
    import Fa from 'svelte-fa'
    import signIn from '$lib/login';

    function loginWithGoogle() {
        signIn();
    }
</script>

<style>
    /* Optional: Add custom styles here if needed */
</style>

<button 
    class="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:hover:bg-gray-700"
    on:click={loginWithGoogle}>
    <Fa icon={faGoogle} class="mr-2" /> Login with Google
</button>
