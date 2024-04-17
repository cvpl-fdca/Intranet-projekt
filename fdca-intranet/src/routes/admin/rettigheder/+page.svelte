<script lang="ts">
	import { getToken } from '$lib/login';
	import { memberStore } from '$lib/memberStore';
	import type { User } from '$lib/user';
	import { userProfileStore } from '$lib/userProfileStore';
	import { Table } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import { tableMapperValues } from '@skeletonlabs/skeleton';

	let members: User[] = [];
	$: {
		members = $memberStore;
	}

	type Element = {
		position: number;
		name: string;
		user: string;
		isAdmin: boolean;
		karkom: boolean;
		strøko: boolean;
		socsam: boolean;
	};

	function setTableSource(): TableSource {
		return {
			head: [
				'Name',
				'User',
				'Admin',
				'Karriere/Kompetence',
				'Strategi/Økonomi',
				'Socialt sammenhold'
			],
			body: tableMapperValues(sourceData, ['name', 'user', 'isAdmin', 'karkom', 'strøko', 'socsam'])
		};
	}

	function getSourceData(members: User[], userMatches: UserMatch[]): Element[] {
		let sourceData: Element[] = [];
		let i = 1;
		let new_el: Element;
		members.forEach((member) => {
			new_el = {
				position: i,
				name: member.details.fullName,
				user: 'Not mapped to member',
				isAdmin: member.roles.isAdmin,
				karkom: member.roles.projects.karkom,
				strøko: member.roles.projects.strøko,
				socsam: member.roles.projects.socsam,
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

	// changePermission('WGExMFtCN7SkYzrY4krJGrlDE6c2','karkom', true, 'PoC'); 
	let userMatches: UserMatch[];
	$: userMatches = getUserMatches(users);

	let sourceData: Element[] = [];
	let tableSimple: TableSource;
	$: sourceData = getSourceData(members, userMatches);
	$: tableSimple = sourceData ? setTableSource() : undefined;
</script>

<Table source={tableSimple} />
