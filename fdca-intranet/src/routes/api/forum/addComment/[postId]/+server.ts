import { json } from '@sveltejs/kit';
import { admin } from '$lib/firebaseAdmin.server.js';
import validator from 'validator';
import { type DecodedIdToken } from 'firebase-admin/auth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getUsername } from '$lib/login.js';
import type { User } from '$lib/user.js';
import { cp } from 'fs';


dayjs.extend(utc);
dayjs.extend(timezone);


// src/routes/api/addComment/+server.ts

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

    // Proceed to create a forum post in Firestore
    const data = await event.request.formData();
    // Extract details from the form data
    console.log('Form data:', data);

    // Extract the forum post ID from the URL parameters
    const postId = event.params.postId;

    // Extract the comment text from the form data
    const text = data.get('text');
    console.log('Comment text:', text);

    // Validate the comment text
    if (text !== null && !validator.isLength(text, { min: 1, max: 1000 })) {
        errors.push('Comment must be between 1 and 1000 characters');
    }

    // If there are any errors, return them
    if (errors.length > 0) {
        return new Response(JSON.stringify({ errors }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Get the user's display name
    const user = await admin.auth().getUser(token.uid);
    username = user.displayName;
    const currentTimeInCopenhagen = dayjs().tz('Europe/Copenhagen').format();

    // Create a new comment document in Firestore
    const commentRef = db.collection('OpenForum').doc(postId).collection('comments').doc();
    await commentRef.set({
        authorUID: token.uid,
        authorName: username,
        text,
        time: currentTimeInCopenhagen,
    });

    return json({ success: true });
}