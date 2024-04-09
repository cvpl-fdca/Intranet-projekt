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
	discord: string;
	pmail: string;
	fmail: string;
	wmail: string;
	pphone: string;
	wphone: string;
};

function setTableSource(): TableSource {
	return {
		head: ['Name', 'Discord', 'Mail privat', 'Mail FDCA', 'Mail arbejde', 'Telefon privat', 'Telefon arbejde'],
		body: tableMapperValues(sourceData, ['name', 'discord', 'pmail', 'fmail', 'wmail', 'pphone', 'wphone']),
	}
};

function getSourceData(members: User[]): Element[] {
	let sourceData: Element[] = [];
	let i = 1;
		var new_el: Element;
	members.forEach(member => {
		try {new_el = {
			position: i,
			name: member.details.fullName,
			discord: member.details.discordName,
			pmail: member.details.email.private,
			fmail: member.details.email.fdca,
			wmail: member.details.email.work,
			pphone: member.details.phone.private,
			wphone: member.details.phone.work,
		};
		console.log(new_el);
		sourceData.push(new_el);
		i+=1;}
		catch (error) {};
	});
	return sourceData;
};

let sourceData: Element[] = [];
let tableSimple: TableSource;
	$: sourceData  = getSourceData(members);
	$: tableSimple = sourceData ? setTableSource() : undefined;
</script>

<Table source={tableSimple} />