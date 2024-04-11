<script lang="ts">
	import Login from './Login.svelte';
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		Avatar,
		Modal,
		type ModalSettings,
		AppRail,
		AppRailTile,
		AppRailAnchor,
		type DrawerSettings,
		Drawer,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';
	import { faSearch, faBars, faHome } from '@fortawesome/free-solid-svg-icons'; // Import the faBars icon
	import Fa from 'svelte-fa';
	import img from '$lib/images/fdca_logo.svg';

	import { initializeStores, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	initializeStores();
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import Profile from '$lib/Profile.svelte';

	const drawerStore = getDrawerStore();

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	import app from '$lib/firebase';
	import signIn, { getUsername, auth } from '$lib/login';

	console.log(app);
	console.log(getUsername());

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import LoginModal from './LoginModal.svelte';
	import { User } from '$lib/user';
	import { userProfileStore } from '$lib/userProfileStore';
	import KontaktDrawer from '$lib/KontaktDrawer.svelte';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const searchModal: ModalSettings = {
		type: 'prompt',
		title: 'Search bar',
		body: 'Search to your hearts content!',
		// No value field is set here; the placeholder is used instead
		valueAttr: {
			type: 'text',
			minlength: 3,
			maxlength: 10,
			required: true,
			placeholder: 'Search' // placeholder is set here
		},
		response: (r: string) => console.log('response:', r)
	};

	let drawerSettings: DrawerSettings = {
		id: 'example-3',
		bgDrawer: 'bg-gray-800 text-white ring-2 ring-gray-700 ring-opacity-100',
		bgBackdrop: 'bg-gray-500 bg-opacity-10',
		width: 'w-64',
		padding: 'p-4',
		rounded: 'rounded-xl',
		position: 'right'
	};

	let sidebarActive = false;

	function toggleSidebar() {
		sidebarActive = !sidebarActive;
		console.log('sidebarActive:', sidebarActive);
	}

	let comboboxKontakt: string = "Kontakt";
	function handleListBoxClick(value: string) {
		if(value === 'kontakt') {
			window.location.href = '/kontakt';
		}
		else if (value === 'medlemmer') {
			window.location.href = '/kontakt/medlemmer';
		} else if (value === 'forslag') {
			window.location.href = '/kontakt/forslag';
		}
	};

	const popupComboKontakt: PopupSettings = {
		event: 'click',
		target: 'popupComboKontakt',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	let currentTile = 0;
</script>

<Login />
<!-- Modal -->
<Modal />

<!-- Right side profile drawer (click on avatar)-->
<Drawer>
	{#if $drawerStore.id === 'example-3'}
		<Profile />
	{:else if $drawerStore.id === 'kontakt-bestyrelse-drawer'}
		<KontaktDrawer />
	{/if}
</Drawer>

<div class="card w-48 shadow-xl py-2" data-popup="popupComboKontakt">
	<ListBox rounded="rounded-none">
		<ListBoxItem bind:group={comboboxKontakt} name="medium" value="kontakt" on:click={() => handleListBoxClick('kontakt')}>Kontakt</ListBoxItem>
		<ListBoxItem bind:group={comboboxKontakt} name="medium" value="medlemmer" on:click={() => handleListBoxClick('medlemmer')}>Medlemmer</ListBoxItem>
		<ListBoxItem bind:group={comboboxKontakt} name="medium" value="forslag" on:click={() => handleListBoxClick('forslag')}>Forslag</ListBoxItem>
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>

<!-- App Shell -->
<AppShell slotPageHeader="h-0.5">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<button class="btn w-4 btn-align" on:click={toggleSidebar}>
					<Fa icon={faBars} class="fa" />
				</button>
				<a href="/">
					<img src={img} alt="FDCA Logo" style="height: 40px;" />
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if $userProfileStore?.roles.isAdmin}
					<a href="/admin" class="btn variant-filled"> Admin </a>
				{/if}
				<a href="/forum" class="btn variant-filled"> Forum </a>
				<a href="/artikler" class="btn variant-filled"> Artikler </a>
				<button class="btn variant-filled justify-between" use:popup={popupComboKontakt}>
					<span class="capitalize">{comboboxKontakt ?? 'Trigger'}</span>
					<span>↓</span>
				</button>
				<button class="btn variant-filled" on:click={() => modalStore.trigger(searchModal)}>
					&nbsp&nbsp&nbspSearch&nbsp&nbsp&nbsp&nbsp&nbsp;
					<Fa icon={faSearch} class="fa" />
				</button>
				<Avatar
					class="w-10"
					border="border-4 border-surface-300-600-token hover:!border-primary-500"
					cursor="cursor-pointer"
					on:click={() => drawerStore.open(drawerSettings)}
				/>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div class="flex items-center justify-center lg:items-start lg:justify-start">
			<div id="sidebar-left" class={sidebarActive ? 'block' : 'hidden'}>
				<AppRail width="w-28">
					<!-- Place the Home link directly inside the AppRail, without using a slot -->
					<AppRailAnchor href="/" class="flex flex-col items-center">
						<Fa icon={faHome} class="fa" />
						<span class="mt-1">Home</span>
					</AppRailAnchor>
					<AppRailTile
						bind:group={currentTile}
						name="tile-2"
						value={1}
						title="tile-2"
						height="h-10"
					>
						<svelte:fragment slot="lead">Artikler</svelte:fragment>
						<span>Tile 1</span>
					</AppRailTile>
					<AppRailTile bind:group={currentTile} name="tile-3" value={2} title="tile-3">
						<svelte:fragment slot="lead">(icon)</svelte:fragment>
						<span>Tile 2</span>
					</AppRailTile>
					<AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
						<svelte:fragment slot="lead">Disskusioner</svelte:fragment>
						<span>Tile 3</span>
					</AppRailTile>
				</AppRail>
			</div>
		</div>
	</svelte:fragment>
	<slot />
</AppShell>
