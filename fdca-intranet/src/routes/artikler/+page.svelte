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

	<!-- Discord Online Users Card -->
	<div class="card bg-white shadow-md rounded-lg p-4">
		<h3 class="card-title text-lg font-semibold">Discord Online</h3>
		<div class="flex flex-col">
			<!-- Repeat this div for each online user, data should be dynamic -->
			<div class="flex items-center mb-2">
				<span class="h-8 w-8 rounded-full bg-green-500 mr-2"></span>
				<span>Mogens</span>
			</div>
			<div class="flex items-center mb-2">
				<span class="h-8 w-8 rounded-full bg-green-500 mr-2"></span>
				<span>Anders</span>
			</div>
			<div class="flex items-center mb-2"></div>
		</div>
	</div>
</div>
