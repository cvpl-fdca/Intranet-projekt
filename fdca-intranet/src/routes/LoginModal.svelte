<script lang="ts">
    import { faGoogle } from '@fortawesome/free-brands-svg-icons';
    import Fa from 'svelte-fa'
    import signIn from '$lib/login';

    function loginWithGoogle() {
        signIn();
    }
</script>


<div class="h-screen w-screen flex justify-center items-center fixed bg-black bg-opacity-80">
    <button 
        class="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:hover:bg-gray-700"
        on:click={loginWithGoogle}>
        <Fa icon={faGoogle} class="mr-2" /> Login with Google
    </button>
</div>
