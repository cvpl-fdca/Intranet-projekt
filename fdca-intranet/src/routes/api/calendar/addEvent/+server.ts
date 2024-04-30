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

        if(userDoc.roles.isAdmin || userDoc.roles.projects.karkom || userDoc.roles.projects.strøko || userDoc.roles.projects.socsam) {
            let eventData = {
                authorUID: token.uid,
                authorName: username,
                eventStart: data.get('eventStart') as string,
                eventEnd: data.get('eventEnd') as string,
                description: data.get('description') as string,
                timeCreated: currentTimeInCopenhagen,
                title: data.get('title') as string,
            };

            console.log('Event:', eventData);
            try {
                console.log('Creating event');
                const eventRef = await admin.firestore().collection('events').add(eventData);
                console.log('Successfully created event', eventRef.id); // Log the document ID
            
                // Get the created event from Firestore
                const createdEvent = await eventRef.get();
                const createdEventData = createdEvent.data();
            
                // Enhance the data with the document ID if needed
                const eventDataWithId = {    
                    id: eventRef.id, // Include the document ID
                    ...createdEventData,
                };
            
                console.log('Event data with ID:', eventDataWithId); // Log the complete document data including the ID
                return json({ success: true, post: eventDataWithId });
            } catch (error) {
                console.error('Failed to create event:', error);
                return new Response(JSON.stringify({ error: 'Failed to create event' }), {
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
}

