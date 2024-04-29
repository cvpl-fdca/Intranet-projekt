import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    return params.article ? { article: params.article } :

	error(404, 'Not found');
};