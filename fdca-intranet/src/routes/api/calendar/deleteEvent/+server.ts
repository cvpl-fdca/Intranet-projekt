import { json } from '@sveltejs/kit';
import { admin, db } from '$lib/firebaseAdmin.server.js';
import { type DecodedIdToken } from 'firebase-admin/auth';
import { getUsername } from '$lib/login.js';
import type { User } from '$lib/user.js';

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
        console.log("token: ", token);
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

        let userDoc = (await admin.firestore().collection('users').doc(token.uid).get()).data() as User;
        
        if(userDoc.roles.isAdmin || userDoc.roles.projects.karkom || userDoc.roles.projects.socsam || userDoc.roles.projects.strøko) {
            const data = await event.request.formData();
            let eventId = data.get('eventId') as string;
            const eventRef = admin.firestore().collection('events').doc(eventId);

            await eventRef.delete();
            return json({success: true});
        } else {
            return new Response(JSON.stringify({ error: 'Unauthorized'}), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error('Failed to delete event: ', error);
        return new Response(JSON.stringify({ error: 'Failed to delete forum post'}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}