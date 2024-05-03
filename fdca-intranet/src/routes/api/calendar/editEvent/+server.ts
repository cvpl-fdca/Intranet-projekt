import { json } from '@sveltejs/kit';
import { admin, db } from '$lib/firebaseAdmin.server.js';
import { type DecodedIdToken } from 'firebase-admin/auth';
import { getUsername } from '$lib/login.js';
import type { User } from '$lib/user.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone.js';
import { validateData } from '$lib/ValidateEventData.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const currentTimeInCopenhagen = dayjs().tz('Europe/Copenhagen').format();

export async function PATCH(event) {
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

    try {
        // Get the event ID from the URL parameters

        let userDoc = (await db.collection('users').doc(token.uid).get()).data() as User;
        username = userDoc.details?.fullName;

        // Get the title and text from the request body
        const data = await event.request.formData();
        
        let authorUID = token.uid;
        let authorName = username;
        let eventStart = data.get('eventStart') as string;
        let eventEnd=  data.get('eventEnd') as string;
        let description = data.get('description') as string;
        let timeCreated =  currentTimeInCopenhagen;
        let title = data.get('title') as string;
        let eventId = data.get('eventId') as string;

        let eventData = {
            authorUID,
            authorName,
            eventStart,
            eventEnd,
            description,
            timeCreated,
            title,
            eventId
        }
        if(!validateData(eventData)) {
            return new Response(JSON.stringify({ error: 'Validation failed' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Get the event from Firestore
        const eventRef = admin.firestore().collection('events').doc(eventId);
        const eventFromDb = await eventRef.get();

        // Check if the user is allowed
        if (eventFromDb.exists && (userDoc.roles.isAdmin || userDoc.roles.projects.karkom || userDoc.roles.projects.socsam || userDoc.roles.projects.strøko)) {
            // Update the event
            await eventRef.update({
                authorUID,
                authorName,
                eventStart,
                eventEnd,
                description,
                timeCreated,
                title
            });

            return json({ success: true });
        } else {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error('Failed to update event:', error);
        return new Response(JSON.stringify({ error: 'Failed to update event' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
