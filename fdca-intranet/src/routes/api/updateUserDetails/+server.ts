// src/routes/api/updateUserDetails/+server.ts
import { json } from '@sveltejs/kit';
import { admin, db } from '$lib/firebaseAdmin.server.js';
import validator from 'validator';


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
    console.log('Form data:', data);
    // Extract details from the form data

    if (validate(data) === true) {
        let userDetails = {
            details: {
                fullName: data.get('name'),
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
                certificate: data.get('certificate'),
                arbejde: data.get('arbejde'),
            },
        };

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
    } else {
        return new Response(JSON.stringify({ errors }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
function validate(userDetails: { get: (arg0: string) => any; }) {
    errors = [];
    const name = userDetails.get('name');
    const telPrivate = userDetails.get('telPrivate');
    const emailFDCA = userDetails.get('emailFDCA');
    const emailPrivate = userDetails.get('emailPrivate');
    const discordName = userDetails.get('discordName');
    const certificate = userDetails.get('certificate');
    const arbejde = userDetails.get('arbejde');

    if (name && !validator.isAlpha(name, 'da-DK', { ignore: ' ' })) {
        errors.push('Invalid name');
    }
    if (telPrivate && !validator.isMobilePhone(telPrivate)) {
        errors.push('Invalid private phone number');
    }
    if (emailFDCA && !validator.isEmail(emailFDCA)) {
        errors.push('Invalid FDCA email');
    }
    if (emailPrivate && !validator.isEmail(emailPrivate)) {
        errors.push('Invalid private email');
    }
    if (discordName && !validator.matches(discordName, /^(?!.*?\.{2,})[a-z0-9_\.]{2,32}$/)) {
        errors.push('Invalid discord name');
    }
    if (certificate && !validator.isAlpha(certificate, 'da-DK', { ignore: ', ' })) {
        errors.push('Invalid certificate');
    }
    if (arbejde && !validator.isAlpha(arbejde, 'da-DK', { ignore: ', ' })) {
        errors.push('Invalid arbejde');
    }
    console.log("errors", errors);
    return errors.length === 0 ? true : false;
}