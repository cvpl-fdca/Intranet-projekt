// src/routes/api/updateUserDetails/+server.ts
import { json } from '@sveltejs/kit';
import { admin } from '$lib/firebaseAdmin.server.js';
import validator from 'validator';

const db = admin.firestore();

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

    let uid;
    try {
        // Verify the Firebase token and decode it to get the UID
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        uid = decodedToken.uid;
        console.log('Successfully authenticated Firebase token:', uid);
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return new Response(JSON.stringify({ error: 'Failed to authenticate Firebase token' }), {
            status: 403,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Proceed to use the UID to update Firestore as before
    const data = await event.request.formData();
    // Extract details from the form data
    if(validate(data)) {
        let userDetails = {
            details: {
                fullName: validator.isAlpha(data.get('name'), 'da-DK') ? data.get('name') : "",
                phone: {
                    private: data.get('telPrivate'),
                    work: data.get('telWork'),
                },
                email: {
                    fdca: data.get('emailFDCA'),
                    private: data.get('emailPrivate'),
                    work: data.get('emailWork'),
                },
                discordName: data.get('discordName'),
            },
        };
    }
    console.log('User details:', userDetails);
    try {
        console.log('Updating user details for UID:', uid);
        console.log('User details to merge into "details":', userDetails);

        await admin.firestore().collection('users').doc(uid).update({
            details: {
                ...userDetails.details
            }
        });

        console.log('Successfully updated user details');

        // Get the updated user details from Firestore
        const updatedUser = await admin.firestore().collection('users').doc(uid).get();
        const updatedDetails = updatedUser.data()?.details ?? {};


        return json({ success: true, details: updatedDetails });
    } catch (error) {
        console.error('Failed to update user details:', error);
        return new Response(JSON.stringify({ error: 'Failed to update user details' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

function validate(userDetails) {
    if(!validator.isAlpha(userDetails.get('name'), 'da-DK')) {
        return false
    }
    if(!validator.isMobilePhone(userDetails.get('telPrivate'))) {
        return false
    }
    if(!validator.isMobilePhone(userDetails.get('telWork'))) {
        return false
    }
    if(!validator.isEmail(userDetails.get('emailFDCA'))) {
        return false
    }
    if(!validator.isEmail(userDetails.get('emailPrivate'))) {
        return false
    }
    if(!validator.isEmail(userDetails.get('emailWork'))) {
        return false
    }
    if(!validator.matches(userDetails.get('discordName'), /^(?!.*?\.{2,})[a-z0-9_\.]{2,32}$/)) {
        return false
    }
    return true
}