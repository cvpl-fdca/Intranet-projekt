<script lang="ts">
	import { memberStore } from '$lib/memberStore';
	import type { User } from '$lib/user';
	import { Table } from '@skeletonlabs/skeleton';
	import type { TableSource} from '@skeletonlabs/skeleton';
	import { tableMapperValues } from '@skeletonlabs/skeleton';

	let members: User[] = [];
	$: {
		members = $memberStore;
	};

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
			head: ['Name', 'User', 'Admin', 'Karriere/Kompetence', 'Strategi/Økonomi', 'Socialt sammenhold'],
			body: tableMapperValues(sourceData, ['name', 'user', 'isAdmin', 'karkom', 'socsam']),
		}
	};

	function getSourceData(members: User[]): Element[] {
		let sourceData: Element[] = [];
		let i = 1;
		let new_el: Element;
		members.forEach(member => {
			new_el = {
				position: i,
				name: member.details.fullName,
				user: "FILLOUT",
				isAdmin: member.roles.isAdmin,
				karkom: member.roles.projects.karkom,
				strøko: member.roles.projects.strøko,
				socsam: member.roles.projects.socsam,
			}
			sourceData.push(new_el);
			i+=1;
		});
		return sourceData;
	};

	let sourceData: Element[] = [];
	let tableSimple: TableSource;
	$: sourceData = getSourceData(members);
	$: tableSimple = sourceData ? setTableSource() : undefined;

</script>

<Table source={tableSimple} />