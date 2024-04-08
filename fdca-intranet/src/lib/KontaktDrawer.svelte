<script>
                import { Textarea, Toolbar, ToolbarGroup, ToolbarButton, Button } from 'flowbite-svelte';
                import { PaperClipOutline, MapPinAltSolid, ImageOutline } from 'flowbite-svelte-icons';
</script>

<div
    id="kontakt-bestyrelse-drawer"
    class="drawer bg-gray-800 text-black ring-2 ring-gray-700 ring-opacity-100 w-128 h-128 p-4 rounded-xl flex flex-col relative h-full"
>
    <div class="flex flex-col justify-between h-full">
        <div class="text-center p-2">
            <form>
                <Textarea class="mb-2 text-white" placeholder="Stil bestyrelsen et spørgsmål." style="height: 150px; background-color: #27313e; box-shadow: 0 0 0 2px gray inset;">
                    <div slot="footer" class="flex items-center justify-between">
                        <Toolbar embedded>
                            <ToolbarButton class="text-white"><PaperClipOutline class="w-10 h-10" /></ToolbarButton>
                            <ToolbarButton class="text-white"><ImageOutline class="w-10 h-10" /></ToolbarButton>
                        </Toolbar>
                        <Button class="bg-white text-black py-2 px-8 rounded-full mr-2" type="submit">Send mail</Button>
                    </div>
                </Textarea>
            </form>
            <p class="ms-auto text-xs text-gray-500 dark:text-gray-400">
                Ved at trykke på "Send mail" accepterer du at din mail bliver sendt til bestyrelsen.
            </p>
        </div>
    </div>
</div>