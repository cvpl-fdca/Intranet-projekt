<script lang="ts">
	import { getModalStore, SlideToggle } from '@skeletonlabs/skeleton';
    import { createEventDispatcher, onDestroy, onMount, SvelteComponent} from 'svelte';
    import { getToken } from '$lib/login';
	import { faGaugeSimpleMed } from '@fortawesome/free-solid-svg-icons';

    type Roles = {
        isAdmin: boolean;
        karkom: boolean;
        karkom_role: string;
        strøko: boolean;
        strøko_role: string;
        socsam: boolean;
        socsam_role: string;
    }
    type Element = {
		position: number;
		name: string;
		user: string;
		isAdmin: boolean;
		karkom: boolean;
		karkom_role: string;
		strøko: boolean;
		strøko_role: string;
		socsam: boolean;
		socsam_role: string;
	};

    const noRoles: Roles = {
        isAdmin: false,
        karkom: false,
        karkom_role: '',
        strøko: false,
        strøko_role: '',
        socsam: false,
        socsam_role: '',
    };

    export let parent: SvelteComponent;
    const modalStore = getModalStore();
    let user: Element;
    let roles: Roles = noRoles;
    let roles_before: Roles;
    let uid: string;

    async function getUserData(): Promise<Element | null> {
        try {
            user = $modalStore[0]?.meta?.user;
            uid = $modalStore[0]?.meta?.uid;
            return user;
        } catch (error) {
            console.error("Could not get user data: ", error);
            return null;
        }
    }
    async function initializeData(): Promise<void> {
        await getUserData();
        if(user) {
            roles_before = {
                isAdmin: user.isAdmin,
                karkom: user.karkom,
                karkom_role: user.karkom_role,
                strøko: user.strøko,
                strøko_role: user.strøko_role,
                socsam: user.socsam,
                socsam_role: user.socsam_role,
            };
            roles = {...roles_before};
        }
    }
    onMount(async () => {
        await initializeData();
        console.log(uid);
    });
    
    function submitChanges() {
        console.log("New roles: ", roles);
        console.log("Roles before: ", roles_before);
        if(roles.isAdmin !== roles_before.isAdmin) {
            changePermission(uid, 'isAdmin', roles.isAdmin, '');
        } if (roles.karkom !== roles_before.karkom || roles.karkom_role !== roles_before.karkom_role) {
            changePermission(uid, 'karkom', roles.karkom, roles.karkom_role);
        } if (roles.strøko !== roles_before.strøko || roles.strøko_role !== roles_before.strøko_role) {
            changePermission(uid, 'strøko', roles.strøko, roles.strøko_role);
        } if (roles.socsam !== roles_before.socsam || roles.socsam_role !== roles_before.socsam_role) {
            changePermission(uid, 'socsam', roles.socsam, roles.socsam_role);
        }

    }
    

    function cancel() {

    }
    
    function toggleAdmin() {
        roles.isAdmin = !roles.isAdmin;
    }
    function toggleKarkom() {
        roles.karkom = !roles.karkom;
    }
    function toggleStrøko() {
        roles.strøko = !roles.strøko;
    }
    function toggleSocsam() {
        roles.socsam = !roles.socsam;
    }

    async function changePermission(userid: string, name: string, setTo: boolean, role: string) {
		try {
			const token = await getToken();
			const requestBody = {
				uid: userid,
				permission: {
					name: name,
					setTo: setTo,
					role: role
				}
			}
			const response = await fetch('/api/admin/changePermissions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-firebase-token': token
					},
					body: JSON.stringify(requestBody)
				});
		} catch (error) {
		}
	}

    

</script>

{#if $modalStore[0]}
  <div class="flex flex-col items-center justify-center">
    <div class="toggle-container" style="display: flex; align-items: center; margin-bottom: 10px;">
        <span class="toggle-label" style="margin-right: 10px;">IsAdmin?</span>
        <SlideToggle name="isAdminToggle" checked={roles.isAdmin} active="bg-primary-500" on:change={toggleAdmin} />
    </div>
    <div class="toggle-container" style="display: flex; align-items: center; margin-bottom: 10px;">
        <span class="toggle-label" style="margin-right: 10px;">Karriere/kommunikation?</span>
        <SlideToggle name="karkomToggle" checked={roles.karkom} active="bg-primary-500" on:change={toggleKarkom} />
    </div>
    {#if roles.karkom}
    <input
      type="string"
      bind:value={roles.karkom_role}
      class="w-[600px] p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"
      placeholder="Karriere/kompetence rolle"
    />
    {/if}
    <div class="toggle-container" style="display: flex; align-items: center; margin-bottom: 10px;">
        <span class="toggle-label" style="margin-right: 10px;">Strategi/Økonomi?</span>
        <SlideToggle name="strøkoToggle" checked={roles.strøko} active="bg-primary-500" on:change={toggleStrøko} />
    </div>
    {#if roles.strøko}
    <input
      type="string"
      bind:value={roles.strøko_role}
      class="w-[600px] p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"
      placeholder="Strategi/Økonomi rolle"
    />
    {/if}
    <div class="toggle-container" style="display: flex; align-items: center; margin-bottom: 10px;">
        <span class="toggle-label" style="margin-right: 10px;">Socialt Sammenhold?</span>
        <SlideToggle name="socsamToggle" checked={roles.socsam} active="bg-primary-500" on:change={toggleSocsam} />
    </div>
    {#if roles.socsam}
    <input
      type="string"
      bind:value={roles.socsam_role}
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