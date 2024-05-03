import { json } from '@sveltejs/kit';
import { admin, db } from '$lib/firebaseAdmin.server.js';



export async function GET({ params }) {
    const { postId } = params; // Extract postId from the request parameters

    try {
        // Retrieve upvotes
        const upvotesRef = db.collection('OpenForslag').doc(postId).collection('upvotes');
        const upvotesSnapshot = await upvotesRef.where('voted', '==', true).get();
        const upvotesCount = upvotesSnapshot.size;

        // Retrieve downvotes
        const downvotesRef = db.collection('OpenForslag').doc(postId).collection('downvotes');
        const downvotesSnapshot = await downvotesRef.where('voted', '==', true).get();
        const downvotesCount = downvotesSnapshot.size;

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
