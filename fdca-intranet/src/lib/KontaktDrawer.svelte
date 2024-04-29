<script lang="ts">
	import { Button, Textarea } from 'flowbite-svelte';
    import { getToken } from './login';
    import { writable } from 'svelte/store';

    let body = writable('');
    let subject = writable('');

    async function sendEmail() {
        try {
            const token = await getToken();
            const submissionFormData = new FormData();
            submissionFormData.append('body', $body);
            submissionFormData.append('subject', $subject);

            // Append the postID to the URL as a parameter
            const response = await fetch(`/api/sendEmail`, {
                method: 'POST',
                headers: {
                    'X-firebase-token': token
                },
                body: submissionFormData
            });
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
</script>

<div id="kontakt-bestyrelse-drawer" class="drawer bg-gray-800 text-black ring-2 ring-gray-700 ring-opacity-100 w-128 h-128 p-4 rounded-xl flex flex-col relative h-full">
    <div class="flex flex-col justify-between h-full">
        <div class="text-center p-2">
            <form>
                <input class="input" bind:value={$subject} placeholder="Emne" />
                <Textarea
                    class="mb-2 text-white"
                    placeholder="Stil bestyrelsen et spørgsmål."
                    style="height: 150px; background-color: #27313e; box-shadow: 0 0 0 2px gray inset;"
                    bind:value={$body}
                />
                <div class="flex items-center justify-between">
                    <Button
                        class="bg-white text-black py-2 px-8 rounded-full mr-2"
                        type="submit"
                        on:click={sendEmail}
                    >
                        Send mail
                    </Button>
                </div>
            </form>
            <p class="ms-auto text-xs text-gray-500 dark:text-gray-400">
                Ved at trykke på "Send mail" accepterer du at din mail bliver sendt til bestyrelsen.
            </p>
        </div>
    </div>
</div>
