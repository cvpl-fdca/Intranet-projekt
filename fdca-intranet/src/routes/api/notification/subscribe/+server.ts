import { json } from '@sveltejs/kit';
import { admin, db } from '$lib/firebaseAdmin.server.js';
import validator from 'validator';
import { type DecodedIdToken } from 'firebase-admin/auth';
import nodemailer from 'nodemailer';
import type { User } from '$lib/user.js';
import path from 'path';



export async function POST(event) {
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
    const email = token.email;
    const uuid = token.uid;
    
    const docRef = db.collection('emailList').doc(page).collection('posts').doc(post).collection('subscribers').doc(uuid); await docRef.set({ email: email });
    return json({ success: 'Subscribed to notifications' });
}
