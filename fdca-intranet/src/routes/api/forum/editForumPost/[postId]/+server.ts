import { json } from '@sveltejs/kit';
import { admin } from '$lib/firebaseAdmin.server.js';
import { type DecodedIdToken } from 'firebase-admin/auth';
import { getUsername } from '$lib/login.js';
import type { User } from '$lib/user.js';

export async function PATCH(event) {
    // Retrieve the Firebase token from the request headers
    const firebaseToken = event.request.headers.get('X-firebase-token');
    if (!firebaseToken) {
        return new Response(JSON.stringify({ error: 'Firebase token not provided' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    let username: string;
    let token: DecodedIdToken;

    try {
        // Verify the Firebase token and decode it to get the UID
        console.log('Verifying Firebase token:', firebaseToken);
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        token = decodedToken;
        console.log('Successfully authenticated Firebase token from user:', token.email);
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return new Response(JSON.stringify({ error: 'Failed to authenticate Firebase token' }), {
            status: 403,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        // Get the forum post ID from the request body
        const postId = event.params.postId;

        // Get the forum post from Firestore
        const forumPostRef = admin.firestore().collection('OpenForum').doc(postId);
        const forumPost = await forumPostRef.get();

        // Check if the user is the author or an admin
        if (forumPost.exists && (forumPost.data().authorUID === token.uid || token.admin)) {
            // Delete the forum post
            await forumPostRef.delete();

            return json({ success: true });
        } else {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error('Failed to delete forum post:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete forum post' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
