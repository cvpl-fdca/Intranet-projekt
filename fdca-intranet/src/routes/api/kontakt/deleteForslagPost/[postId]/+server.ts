import { json } from '@sveltejs/kit';
import { admin } from '$lib/firebaseAdmin.server.js';
import { type DecodedIdToken } from 'firebase-admin/auth';
import { getUsername } from '$lib/login.js';
import type { User } from '$lib/user.js';

const db = admin.firestore();

export async function DELETE(event) {
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
        console.log('Token:', token);
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return new Response(JSON.stringify({ error: 'Failed to authenticate Firebase token' }), {
            status: 403,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    let userDoc = (await db.collection('users').doc(token.uid).get()).data() as User;

    let isAdmin = userDoc.roles.isAdmin;

    try {
        // Get the forslag post ID from the request body
        const postId = event.params.postId;

        // Get the forslag post from Firestore
        const forslagPostRef = admin.firestore().collection('OpenForslag').doc(postId);
        const forslagPost = await forslagPostRef.get();

        // Check if the user is the author or an admin
        console.log('is the user admin: ', isAdmin);



        if (forslagPost.exists && (forslagPost.data().authorUID === token.uid || isAdmin === true)) {
            console.log('Deleting forslag post');
            // Delete the forslag post
            await forslagPostRef.delete();
            console.log('Forslag post deleted');
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
        console.error('Failed to delete forslag post:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete forslag post' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
