import { json } from '@sveltejs/kit';
import { admin, db } from '$lib/firebaseAdmin.server.js';
import validator from 'validator';
import { type DecodedIdToken } from 'firebase-admin/auth';
import nodemailer from 'nodemailer';
import type { User } from '$lib/user.js';
import path from 'path';
import { getEmailSecret } from './getSecret.server';
import { getDocs } from 'firebase/firestore';




/**
 * Sends notification emails to all subscribers of a specific post.
 *
 * @param {string} userFirebaseToken - The Firebase token of the user.
 * @param {string} subject - The subject of the email.
 * @param {string} body - The body of the email.
 * @param {string} page - The page where the post is located.
 * @param {string} post - The post that the subscribers are subscribed to.
 * 
 * @returns {Promise<object>} A promise that resolves to an object containing the result of the operation.
 * 
 * @throws {Error} If the Firebase token is not provided or fails to authenticate.
 * @throws {Error} If an invalid email address is provided.
 * @throws {Error} If there's an error sending the email.
 */
export async function sendNotifications(userFirebaseToken: string, subject: string, body: string, page: string, post: string) {
    let keys: JSON;

    try {
        // Retrieve the email account JSON from the Azure Key Vault
        keys = await getEmailSecret().then((result) => {
            if (result && result.emailAccountJson) {
                return JSON.parse(result.emailAccountJson);
            } else {
                throw new Error("emailAccountJson is undefined");
            }
        });
        console.log('Keys:', keys);
    } catch (error) {
        console.error('Failed to retrieve or parse keys:', error);
    }

    // Retrieve the Firebase token from the request headers 
    if (!userFirebaseToken) {
        return json({ error: 'Firebase token not provided' }, { status: 401 });
    }

    let token: DecodedIdToken;
    try {
        token = await admin.auth().verifyIdToken(userFirebaseToken);
        console.log('Successfully authenticated Firebase token from user:', token.email);
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return json({ error: 'Failed to authenticate Firebase token' }, { status: 403 });
    }



    // Initialize nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: "fdca-intranet@fdca.dk",
            privateKey: keys.private_key,
            serviceClient: keys.client_id
        }
    });



    // Fetch the list of subscribers from the database
    const subscribersCollection = db.collection('emailList').doc(page).collection('posts').doc(post).collection('subscribers');
    const snapshot = await subscribersCollection.get();
    const subscribers = snapshot.docs.map(doc => doc.data());
    console.log('Subscribers:', subscribers);
    // Iterate over the list of subscribers and send an email to each one
    for (const subscriber of subscribers) {
        // Validate recipient email format
        if (!validator.isEmail(subscriber.email)) {
            return json({ error: 'Invalid email address provided.' }, { status: 400 });
        }


        console.log('Sending mail to:', subscriber);
        const mailOptions = {
            from: "fdca-intranet@fdca.dk",
            replyTo: token.email,
            to: subscriber.email, // Send the email to the subscriber
            subject: "Intranet: " + subject,
            html: body,
        };

        try {
            console.log('Sending mail to:', subscriber.email);
            const info = await transporter.sendMail(mailOptions);
            console.log('SendMail result:', info);
        } catch (error) {
            console.error('Error sending email to:', subscriber.email, error);
        }
    }
}
