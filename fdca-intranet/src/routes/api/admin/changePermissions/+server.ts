import { admin, db } from '$lib/firebaseAdmin.server.js';
import { type DecodedIdToken } from 'firebase-admin/auth';
import type { User } from '$lib/user.js';
import { json } from '@sveltejs/kit';
import validator from 'validator';



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
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        token = decodedToken;
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
        const data: {uid: string, permission: {name: string, setTo: boolean, role: string}} = await event.request.json();
        const affectedUid = data.uid;
        const affectedPermission = data.permission;
        
        const userRef = admin.firestore().collection('users').doc(affectedUid);
        if(data.permission.name === 'isAdmin') {
            let isAdmin = data.permission.setTo;
            await userRef.update({
                'roles.isAdmin': isAdmin
            });
        } else {
            if(validator.isEmpty(data.permission.role)) {
                return new Response(JSON.stringify({ error: 'Validation failed' }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
            const groupRef = admin.firestore().collection('groups').doc(data.permission.name);
            let docRef: admin.firestore.DocumentReference = admin.firestore().doc(`users/${data.uid}`);
            let updateGroupObject = {[`members.${data.uid}`]: {role: data.permission.role, userRef: docRef}};
            if (data.permission.setTo) {
                await groupRef.update(updateGroupObject);
            } else {
                await groupRef.update({ [`members.${data.uid}`]: admin.firestore.FieldValue.delete()});
            }
            let updateUserObject = {[`roles.projects.${data.permission.name}`]: data.permission.setTo};
            await userRef.update(updateUserObject);
        }
    return json({ success: true });
    } else {
        new Response(JSON.stringify({ error: 'Permission denied' }), {
            status: 403,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}