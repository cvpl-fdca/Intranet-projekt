import { json } from '@sveltejs/kit';
import { admin } from '$lib/firebaseAdmin.server.js';
import validator from 'validator';
import { type DecodedIdToken } from 'firebase-admin/auth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getUsername } from '$lib/login.js';
import type { User } from '$lib/user.js';

const db = admin.firestore();
let errors: string[] = [];

export async function POST(event) {
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

    let username: string | undefined;
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

    // Proceed to create a post in Firestore
    const data = await event.request.formData();
    // Extract details from the form data
    console.log('Form data:', data);

    const voteDirection = data.get('voteDirection');

    // Extract the forslag post ID from the URL parameters
    const postId = event.params.postId;

    // Get the user's display name
    const user = await admin.auth().getUser(token.uid);
    username = user.displayName;

    // Create a new comment document in Firestore
    if(voteDirection === 'upvote') {
        const downvoted = db.collection('OpenForslag').doc(postId).collection('downvotes').doc(token.uid);
        try {
            if((await downvoted.get()).data().voted) {
                return new Response(JSON.stringify({ error: 'Already voted.'}), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {}
        const commentRef = db.collection('OpenForslag').doc(postId).collection('upvotes').doc(token.uid);
        await commentRef.set({
            voted: true
        });
    } else if (voteDirection === 'downvote') {
        const upvoted = db.collection('OpenForslag').doc(postId).collection('upvotes').doc(token.uid);
        try {
            if((await upvoted.get()).data().voted) {
                return new Response(JSON.stringify({error: 'Already voted.'}), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {}
        const commentRef = db.collection('OpenForslag').doc(postId).collection('downvotes').doc(token.uid);
        await commentRef.set({
            voted: true
        });
    } else {
        return new Response(JSON.stringify({ error: 'Vote failed' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    return json({ success: true });
}