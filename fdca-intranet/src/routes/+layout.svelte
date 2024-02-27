<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		Avatar,
		Modal,
		type ModalSettings,
		AppRail,
		AppRailTile,
		AppRailAnchor
	} from '@skeletonlabs/skeleton';
	import { faSearch, faBars, faHome } from '@fortawesome/free-solid-svg-icons'; // Import the faBars icon
	import Fa from 'svelte-fa';
	import img from '$lib/images/fdca_logo.svg';
	import { navigate } from 'svelte-routing';

	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const searchModal: ModalSettings = {
		type: 'prompt',
		// Data
		title: 'Enter Name',
		body: 'Provide your first name in the field below.',
		// Populates the input value and attributes
		value: 'Skeleton',
		valueAttr: { type: 'text', minlength: 3, maxlength: 10, required: true },
		// Returns the updated response value
		response: (r: string) => console.log('response:', r)
	};

	let sidebarActive = false;

	function toggleSidebar() {
		sidebarActive = !sidebarActive;
		console.log('sidebarActive:', sidebarActive);
	}

	let currentTile = 0;
</script>

<!-- Modal -->
<Modal />

<!-- App Shell -->
<AppShell slotPageHeader="h-0.5">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<button class="btn w-4" on:click={toggleSidebar}>
					<Fa icon={faBars} class="fa" />
				</button>

				<a href="/">
					<img src={img} alt="FDCA Logo" style="height: 40px;" />
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<button class="btn variant-filled" on:click={() => navigate('/kontakt')}> Kontakt </button>
				<button class="btn variant-filled" on:click={() => modalStore.trigger(searchModal)}>
					&nbsp&nbsp&nbspSearch&nbsp&nbsp&nbsp&nbsp&nbsp;
					<Fa icon={faSearch} class="fa" />
				</button>
				<Avatar
					class="w-11"
					border="border-4 border-surface-300-600-token hover:!border-primary-500"
					cursor="cursor-pointer"
				/>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div class="flex items-center justify-center lg:items-start lg:justify-start">
			<div id="sidebar-left" class={sidebarActive ? 'block' : 'hidden'}>
				<AppRail width="w-16">
					<!-- --- -->
					<AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
						<svelte:fragment slot="lead">(icon)</svelte:fragment>
						<span>Tile 1</span>
					</AppRailTile>
					<AppRailTile bind:group={currentTile} name="tile-2" value={1} title="tile-2">
						<svelte:fragment slot="lead">(icon)</svelte:fragment>
						<span>Tile 2</span>
					</AppRailTile>
					<AppRailTile bind:group={currentTile} name="tile-3" value={2} title="tile-3">
						<svelte:fragment slot="lead">(icon)</svelte:fragment>
						<span>Tile 3</span>
					</AppRailTile>
					<svelte:fragment slot="trail">
						<AppRailAnchor href="/" class="flex flex-col items-center">
							<Fa icon={faHome} class="fa" />
							<span class="mt-1">Home</span>
						</AppRailAnchor>
					</svelte:fragment>
				</AppRail>
			</div>
		</div></svelte:fragment
	>
	<slot />
</AppShell>
