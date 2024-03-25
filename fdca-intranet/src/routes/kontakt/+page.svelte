<script lang="ts">
	interface BoardMember {
		name: string;
		phone: string;
		address: string;
		imageUrl: string;
		additionalText: string;
	}
	interface CommitteeMember {
		name: string;
		phone: string;
		address: string;
		imageUrl: string;
		additionalText: string;
	}

	// Example array of board members
	let boardMembers: BoardMember[] = [
		{
			name: 'Mogens',
			phone: 'Phone:',
			address: 'Address:',
			additionalText: 'Additional info:',
			imageUrl: 'https://plus.unsplash.com/premium_photo-1669324357471-e33e71e3f3d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		},
		{
			name: 'Sofie',
			phone: '123-456-7890',
			address: '123 Main St',
			additionalText: 'Additional info',
			imageUrl: '/path/to/existing/member/image.jpg'
		},
		{
			name: 'Anders',
			phone: '123-456-7890',
			address: '123 Main St',
			additionalText: 'Additional info',
			imageUrl: '/path/to/existing/member/image.jpg'
		},
		{
			name: 'Anders',
			phone: '123-456-7890',
			address: '123 Main St',
			additionalText: 'Additional info',
			imageUrl: '/path/to/existing/member/image.jpg'
		},
		{
			name: 'Philip',
			phone: '123-456-7890',
			address: '123 Main St',
			additionalText: 'Additional info',
			imageUrl: '/path/to/existing/member/image.jpg'
		}
	];

	// Example array of committee members
	let committeeMembers: CommitteeMember[] = [
		{
			name: 'Who',
			phone: '123-456-7890',
			address: '123 Main St',
			additionalText: 'Additional info',
			imageUrl: '/path/to/existing/member/image.jpg'
		},
		{
			name: 'Are',
			phone: '123-456-7890',
			address: '123 Main St',
			additionalText: 'Additional info',
			imageUrl: '/path/to/existing/member/image.jpg'
		},
		{
			name: 'You',
			phone: '123-456-7890',
			address: '123 Main St',
			additionalText: 'Additional info',
			imageUrl: '/path/to/existing/member/image.jpg'
		}
	];
</script>

<div class="container mx-auto p-4">
	<!-- Bestyrelse Section -->
	<div class="card bg-blue-800 shadow-md rounded-lg p-4 mb-4">
		<h3 class="text-3xl font-semibold text-white mb-4 text-center">Bestyrelse</h3>
		<div class="grid grid-flow-row-dense grid-cols-auto-fit gap-4">
			{#each boardMembers as member, i (i)}
				<div class="card p-4 bg-white rounded shadow-lg">
					<div class="flex flex-col items-center">
						<img
							class="w-24 h-24 rounded-full mb-3"
							src={member.imageUrl}
							alt={`Picture of ${member.name}`}
						/>
						<div class="text-center">
							<h4 class="font-semibold">{member.name}</h4>
							<p>{member.phone}</p>
							<p class="text-sm">{member.address}</p>
							<p class="text-sm">{member.additionalText}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
<!-- Udvalg Section -->
<div class="container mx-auto p-4">
	<div class="card bg-blue-800 shadow-md rounded-lg p-4 mb-4">
		<h3 class="text-3xl font-semibold text-white mb-4 text-center">Udvalg</h3>
		<div class="grid grid-flow-row-dense grid-cols-auto-fit gap-4">
			{#each committeeMembers as member, i (i)}
				<div class="card p-4 bg-white rounded shadow-lg">
					<div class="flex flex-col items-center">
						<img
							class="w-24 h-24 rounded-full mb-3"
							src={member.imageUrl}
							alt={`Picture of ${member.name}`}
						/>
						<div class="text-center">
							<h4 class="font-semibold">{member.name}</h4>
							<p>{member.phone}</p>
							<p class="text-sm">{member.address}</p>
							<p class="text-sm">{member.additionalText}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.grid-cols-auto-fit {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		grid-gap: 1rem;
	}

	.card {
		transition: background-color 0.3s ease;
		/* If the cards need a fixed width, you can specify it here, and they will maintain the width regardless of screen size */
		/* width: 240px; */
	}
</style>
