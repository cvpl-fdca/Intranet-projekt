import { json } from '@sveltejs/kit';
import { admin } from '$lib/firebaseAdmin.server.js';
import validator from 'validator';
import { type DecodedIdToken } from 'firebase-admin/auth';
import nodemailer from 'nodemailer';
import type { User } from '$lib/user.js';
import path from 'path';
import keys from '/secrets/fdca-intranet-dev-test-0fcb3c7d3892.json';



export async function POST(event) {
    console.log(keys.private_key)
    console.log(keys.client_id)

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
    // Initialize nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: token.email,
            privateKey: keys.private_key,
            serviceClient: keys.client_id
        }
    });
    const formData = await event.request.formData();
    const to = formData.get('to')?.toString() || "default@example.com";
    const subject = formData.get('subject')?.toString() || "No Subject";
    const body = formData.get('body')?.toString() || "No Content";

    // Validate recipient email format
    if (!validator.isEmail(to)) {
        return json({ error: 'Invalid email address provided.' }, { status: 400 });
    }

    const mailOptions = {
        from: token.email,
        to: "dm@fdca.dk", // todo, change to kontakt@fdca.dk to hit the real inbox
        subject: "Besked fra intranet",
        text: body,
    };



    try {
        console.log('Verifying transporter...');
        await transporter.verify((error, success) => {
            if (error) {
                console.error('Verification error:', error);
            } else {
                console.log('Verification result:', success);
            }
        });
        console.log('Sending mail...');
        const info = await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('SendMail error:', error);
            } else {
                console.log('SendMail result:', info);
            }
        });
        return json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: 'Failed to send email' }, { status: 500 });
    }
}
