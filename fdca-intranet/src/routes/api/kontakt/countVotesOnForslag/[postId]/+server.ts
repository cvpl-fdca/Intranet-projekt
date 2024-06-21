import { json } from '@sveltejs/kit';
import { admin, db } from '$lib/firebaseAdmin.server.js';

export async function GET({ params }) {
    const { postId } = params; // Extract postId from the request parameters

    let upvotesCount = 0;
    let downvotesCount = 0;

    try {
        // Try to retrieve upvotes
        try {
            const upvotesRef = db.collection('OpenForslag').doc(postId).collection('upvotes');
            const upvotesSnapshot = await upvotesRef.where('voted', '==', true).get();
            upvotesCount = upvotesSnapshot.empty ? 0 : upvotesSnapshot.size;
        } catch (error) {
            console.error('Error fetching upvotes:', error);
            upvotesCount = 0; // Set to 0 if there's an error (e.g., collection doesn't exist)
        }

        // Try to retrieve downvotes
        try {
            const downvotesRef = db.collection('OpenForslag').doc(postId).collection('downvotes');
            const downvotesSnapshot = await downvotesRef.where('voted', '==', true).get();
            downvotesCount = downvotesSnapshot.empty ? 0 : downvotesSnapshot.size;
        } catch (error) {
            console.error('Error fetching downvotes:', error);
            downvotesCount = 0; // Set to 0 if there's an error
        }

        // Return both counts in one response
        return json({ upvotesCount, downvotesCount });
    } catch (error) {
        console.error('Error counting votes:', error);
        return new Response(JSON.stringify({ error: 'Error counting votes' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}