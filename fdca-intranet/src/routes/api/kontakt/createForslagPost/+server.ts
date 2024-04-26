import { json } from '@sveltejs/kit';
import { admin } from '$lib/firebaseAdmin.server.js';
import validator from 'validator';
import { type DecodedIdToken } from 'firebase-admin/auth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getUsername } from '$lib/login.js';
import type { User } from '$lib/user.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const currentTimeInCopenhagen = dayjs().tz('Europe/Copenhagen').format();
console.log(currentTimeInCopenhagen);

// src/routes/api/kontakt/createForslagPost/+server.ts

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

    // Proceed to create a forum post in Firestore
    const data = await event.request.formData();
    // Extract details from the form data
    console.log('Form data:', data);



    //TODO: Validate the form data
    if (true) {
        let userDoc = (await db.collection('users').doc(token.uid).get()).data() as User;
        username = userDoc.details?.fullName;

        let forslagPost = {
            authorUID: token.uid,
            authorName: username,
            text: data.get('text') as string,
            time: currentTimeInCopenhagen,
            title: data.get('title') as string,
        };

        console.log('Forslag post:', forslagPost);
        try {
            console.log('Creating forslag');
            const forslagPostRef = await admin.firestore().collection('OpenForslag').add(forslagPost);
            console.log('Successfully created forslag post', forslagPostRef.id); // Log the document ID
        
            // Get the created forum post from Firestore
            const createdPost = await forslagPostRef.get();
            const createdPostData = createdPost.data();
        
            // Enhance the data with the document ID if needed
            const postDataWithId = {    
                id: forslagPostRef.id, // Include the document ID
                ...createdPostData,
            };
        
            console.log('Forslag data with ID:', postDataWithId); // Log the complete document data including the ID
            return json({ success: true, post: postDataWithId });
        } catch (error) {
            console.error('Failed to create forslag:', error);
            return new Response(JSON.stringify({ error: 'Failed to create forslag' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } else {
        return new Response(JSON.stringify({ errors }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

