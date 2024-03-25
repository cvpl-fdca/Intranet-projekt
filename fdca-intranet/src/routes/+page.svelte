<script lang="ts">
	// You can add your script here if you need to handle any logic
</script>

<div class="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Calendar and News/Articles Card -->
    <div>
        <!-- Calendar Card -->
        <div class="card bg-white shadow-md rounded-lg p-4 mb-4">
			<!-- Add margin-bottom here -->
            <h3 class="card-title text-lg font-semibold">Kalender</h3>
            <ul class="list-disc pl-5">
                <li>4/20: Get it? Huh</li>
                <li>6/9: It's a thing</li>
                <li>7/2: More events</li>
            </ul>
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
