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
			body: tableMapperValues(sourceData, ['name', 'user', 'isAdmin', 'karkom', 'socsam'])
		};
	}

	function getSourceData(members: User[]): Element[] {
		let sourceData: Element[] = [];
		let i = 1;
		let new_el: Element;
		members.forEach((member) => {
			new_el = {
				position: i,
				name: member.details.fullName,
				user: 'FILLOUT',
				isAdmin: member.roles.isAdmin,
				karkom: member.roles.projects.karkom,
				strøko: member.roles.projects.strøko,
				socsam: member.roles.projects.socsam
			};
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
			console.log('Hello2');
			console.log(response)
			return response;
		} catch (error) {
			console.error('Error:', error.message);
		}
	}
	type UserMatch = {
		uid: string,
		email: string,
	};

	let users: any;
	getUsers().then((response) => {
		response?.json().then((response) => {
			users = response.data;
		});
	});
	
	
	function getUserMatches(users: any) {
		try {
			let userMatches: UserMatch[] = [];
			let i = 0;
			users.forEach(user => {
				userMatches.push({uid: user.i.uid, email: user.i.email});
			});
			return userMatches;
		} catch (error) {
			return [];
		}
	};
	$: console.log(users);
	let userMatches: UserMatch[];
	$: userMatches = getUserMatches(users);
	$: console.log(userMatches);

	let sourceData: Element[] = [];
	let tableSimple: TableSource;
	$: sourceData = getSourceData(members);
	$: tableSimple = sourceData ? setTableSource() : undefined;
</script>

<Table source={tableSimple} />
