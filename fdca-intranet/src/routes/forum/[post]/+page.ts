import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    return params.post ? { post: params.post } :

	error(404, 'Not found');
};