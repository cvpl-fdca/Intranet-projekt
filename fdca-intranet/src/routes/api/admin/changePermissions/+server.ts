import { admin } from '$lib/firebaseAdmin.server.js';
import { type DecodedIdToken } from 'firebase-admin/auth';
import type { User } from '$lib/user.js';
import { json } from '@sveltejs/kit';

const db = admin.firestore();

export async function POST(event) {
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

    let userDoc = (await db.collection('users').doc(token.uid).get()).data() as User;


    if(userDoc.roles.isAdmin) {
        const data = await event.request.formData();
        const affectedUid = data.user.uid;
        const affectedPermission = data.permission;
        const userRef = admin.firestore().collection('users').doc(affectedUid);
        if(data.permission.name === 'isAdmin') {
            let roles.isAdmin = data.permission.setTo;
            await userRef.update({
                roles.isAdmin,
            });
        } else if(data.permission.name === 'karkom') {
            let roles.projects.karkom = data.permission.setTo;
            await userRef.update({
                roles.projects.karkom,
            });
        } else if(data.permission.name === 'strøko') {
            let roles.projects.strøko = data.permission.setTo;
            await userRef.update({
                roles.projects.strøko,
            });
        } else if(data.permission.name === 'socsam') {
            let roles.projects.socsam = data.permission.setTo;
            await userRef.update({
                roles.projects.socsam,
            });
        }
    }
}