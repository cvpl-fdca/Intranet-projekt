import { json } from '@sveltejs/kit';
import { admin } from '$lib/firebaseAdmin.server.js';
import { type DecodedIdToken } from 'firebase-admin/auth';


/**
 * Unsubscribes from a specific page.
 * 
 * @param page - The page to unsubscribe from.
 * @returns A Promise that resolves to the response from the server.
 */
export async function DELETE(event) {
    // Retrieve the Firebase token from the request headers
    const firebaseToken = event.request.headers.get('X-firebase-token');
    if (!firebaseToken) {
        return json({ error: 'Firebase token not provided' }, { status: 401 });
    }

    let token: DecodedIdToken;
    try {
        token = await admin.auth().verifyIdToken(firebaseToken);
        console.log('Successfully authenticated Firebase token from user:', token.email);
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return json({ error: 'Failed to authenticate Firebase token' }, { status: 403 });
    }

    // Insert the user in emailList/{page}/subscribers/{UUID}
    const formData = await event.request.formData();
    console.log(formData)

    const page = formData.get('page').toString();
    const post = formData.get('post').toString();
    // Delete the user from emailList/{page}/subscribers/{UUID}
    const email = token.email;
    const uuid = token.uid;
    const db = admin.firestore();
    const docRef = db.collection('emailList').doc(page).collection('posts').doc(post).collection('subscribers').doc(uuid);
    await docRef.delete();

    return json({ success: 'Unsubscribed from notifications' });
}

