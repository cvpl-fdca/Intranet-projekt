<script lang="ts">
	import { groupStore } from '$lib/groupStore';
	import { getToken } from '$lib/login';
	import { memberStore } from '$lib/memberStore';
	import type { User } from '$lib/user';
	import EditPermissions from '$lib/EditPermissions.svelte';
	import { userProfileStore } from '$lib/userProfileStore';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import {tableMapperValues } from '@skeletonlabs/skeleton';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { Modal } from 'flowbite';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	
	let showModal = false;

	let members: User[] = [];
	let groups: Group[] = [];
	$: {
		members = $memberStore;
		groups = $groupStore;
	}
	
	type GroupMember = {
		role: string;
		userRef: any;
	}
	type Group = {
		id: string;
		members: { [uid: string]: GroupMember};
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

	function setTableSource(): TableSource {
		return {
			head: [
				'Name',
				'User',
				'Admin',
				'Karriere/Kompetence',
				'Rolle',
				'Strategi/Økonomi',
				'Rolle',
				'Socialt sammenhold',
				'Rolle',

			],
			body: tableMapperValues(sourceData, [
				'name',
				'user',
				'isAdmin',
				'karkom',
				'karkom_role',
				'strøko',
				'strøko_role',
				'socsam',
				'socsam_role',
			])
		};
	}

	function getSourceData(members: User[], userMatches: UserMatch[]): Element[] {
		let sourceData: Element[] = [];
		let i = 1;
		let new_el: Element;
		members.forEach((member) => {
			let karkom_role = '';
			let strøko_role = '';
			let socsam_role = '';
			groups.forEach((group) => {
				if(member.roles.projects.karkom && group.id === 'karkom') {
					karkom_role = group?.members?.[member.uid]?.role;
				} else if (member.roles.projects.strøko && group.id === 'strøko') {
					strøko_role = group?.members?.[member.uid]?.role;
				} else if (member.roles.projects.socsam && group.id === 'socsam') {
					socsam_role = group?.members?.[member.uid]?.role;
				}
			});
			new_el = {
				position: i,
				name: member.details.fullName,
				user: 'Not mapped to member',
				isAdmin: member.roles.isAdmin,
				karkom: member.roles.projects.karkom,
				karkom_role: karkom_role,
				strøko: member.roles.projects.strøko,
				strøko_role: strøko_role,
				socsam: member.roles.projects.socsam,
				socsam_role: socsam_role,
			};
			for (let user of userMatches) {
				if(member.uid === user.uid) {
					new_el.user = user.email;
					break;
				}
			}
			sourceData.push(new_el);
			i += 1;
		});
		return sourceData;
	}

	async function getUsers() {
		let userDoc;
		userProfileStore.subscribe((value) => {
			userDoc = value as User;
		});
		try {
			const token = await getToken();

			const response = await fetch('/api/admin/getUserIdentifier', {
				method: 'GET',
				headers: {
					'X-firebase-token': token
				}
			});
			return response;
		} catch (error) {
			console.error('Error:', error.message);
		}
	}
	type UserMatch = {
		uid: string;
		email: string;
	};

	let users: any;
	getUsers().then((response) => {
		response?.json().then((response) => {
			users = response.data;
		});
	});

	function getUserMatches(usersObj: any) {
		try {
			let userMatches: UserMatch[] = [];
			usersObj.users.forEach((user: { uid: any; email: any }) => {
				userMatches.push({ uid: user.uid, email: user.email });
			});
			return userMatches;
		} catch (error) {
			return [];
		}
	}

	let userMatches: UserMatch[];
	$: userMatches = getUserMatches(users);

	let sourceData: Element[] = [];
	$: sourceData = getSourceData(members, userMatches);

	const modalStore = getModalStore();

	const editPermissions: ModalComponent = { ref: EditPermissions };

	let modal: ModalSettings;

	function findUID(user: Element) {
		let uid: string = '';
		for (let match of userMatches) {
			if(user.user === match.email) {
				uid = match.uid;
				break;
			}
		};
		return uid;
	}

	async function openModal(element: Element) {
		let uid = findUID(element);
		modal = {
			type: 'component',
			component: editPermissions,
			meta: {
				user: element,
				uid: uid,
			}
		};
		modalStore.trigger(modal);
	}

	function closeModal() {
		showModal = false;
	}
	modalStore.close();

</script>

<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Name</th>
				<th>User</th>
				<th>Admin</th>
				<th>Karriere/Kompetence</th>
				<th>Rolle</th>
				<th>Strategi/Økonomi</th>
				<th>Rolle</th>
				<th>Socialt Sammenhold</th>
				<th>Rolle</th>
				<th>Redigér</th>
			</tr>
		</thead>
		<tbody>
			{#each sourceData as user}
				<tr key={user.user}>
					<td>{user.name}</td>
					<td>{user.user}</td>
					<td>{user.isAdmin}</td>
					<td>{user.karkom}</td>
					<td>{user.karkom_role}</td>
					<td>{user.strøko}</td>
					<td>{user.strøko_role}</td>
					<td>{user.socsam}</td>
					<td>{user.socsam_role}</td>
					<td><button class="btn variant-filled" on:click={openModal(user)}>Redigér</button></td>
				</tr>
				{/each}
		</tbody>
	</table>
</div>