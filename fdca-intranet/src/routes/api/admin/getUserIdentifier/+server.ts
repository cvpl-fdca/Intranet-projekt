import { admin, db } from '$lib/firebaseAdmin.server.js';
import { type DecodedIdToken } from 'firebase-admin/auth';
import type { User } from '$lib/user.js';
import firebase from '$lib/firebase';
import { json } from '@sveltejs/kit';




export async function GET(event) {
    // Retrieve Firebase token from the request headers
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

    let userDoc = (await db.collection('users').doc(token.uid).get()).data() as User;
    if(userDoc.roles.isAdmin) {
        let users = await admin.auth().listUsers()
        return json({ success: true, data: users});
    }
    return new Response(JSON.stringify({error: 'Permission denied'}), {
        status: 403,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}