import { json } from '@sveltejs/kit';
import { admin } from '$lib/firebaseAdmin.server.js';
import { type DecodedIdToken } from 'firebase-admin/auth';
import validator from 'validator';


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

    // Proceed to add a like to a forum post in Firestore
    const data = await event.request.formData();
    // Extract details from the form data
    console.log('Form data:', data);

    // Extract the forum post ID from the URL parameters
    const postId = event.params.postId;

    // Extract the user ID from the form data
    const uid = data.get('uid');

    // Validate the user ID
    if (uid !== token.uid) {
        errors.push('User ID does not match the authenticated user');
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

    // Add a like to the forum post document in Firestore
    const postRef = admin.firestore().collection('OpenForum').doc(postId);
    await postRef.update({
        likes: admin.firestore.FieldValue.arrayUnion(uid)
    });

    return json({ success: true });
}