import { json } from '@sveltejs/kit';
import { admin, db } from '$lib/firebaseAdmin.server.js';
import { type DecodedIdToken } from 'firebase-admin/auth';
import { getUsername } from '$lib/login.js';
import type { User } from '$lib/user.js';
import { sendNotifications } from '$lib/notification.server';

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
        // Get the forum post ID from the URL parameters
        const postId = event.params.postId;

        // Get the title and text from the request body
        const formData = await event.request.formData();
        const title = formData.get('title');
        const text = formData.get('text');
        const page = formData.get('page');

        console.log('Form data:', formData);
        if (!title || !text || !page) {
            return new Response(JSON.stringify({ error: 'Missing title, text, or page\n formdata is: ' + formData }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Get the forum post from Firestore
        const articleRef = admin.firestore().collection('articles').doc(page).collection('posts').doc(postId);
        const article = await articleRef.get();

        // Check if the user is the author or an admin
        if (article.exists && (article.data().authorUID === token.uid || token.admin)) {
            // Update the forum post
            await articleRef.update({
                title,
                text
            });

            // Send notifications to subscribers of articles
            sendNotifications(firebaseToken, title.toString() + ' was edited',
                (`
                             <html>
                                 <body>
                                     <h1>New Article</h1>
                                     <h2>Title: ${title.toString()}</h2>
                                     <h3>Editor: ${token.email}</h3>
                                     <a href="https://intranet.fdca.dk/artikler/${page}/${articleRef.id}">View post</a>
                                 </body>
                             </html>
                     `), page.toString(), "all");

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
        console.error('Failed to update forum post:', error);
        return new Response(JSON.stringify({ error: 'Failed to update forum post' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
