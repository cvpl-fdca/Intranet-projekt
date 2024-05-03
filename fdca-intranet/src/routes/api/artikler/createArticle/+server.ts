import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { type DecodedIdToken } from 'firebase-admin/auth';
import { admin, db } from '$lib/firebaseAdmin.server.js';
import { json } from '@sveltejs/kit';
import type { User } from '$lib/user';
import { sendNotifications } from '$lib/notification.server';
import { sanitizeMarkdown } from '$lib/sanitizeMarkdown';

dayjs.extend(utc);
dayjs.extend(timezone);

const currentTimeInCopenhagen = dayjs().tz('Europe/Copenhagen').format();
console.log(currentTimeInCopenhagen);



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

    const data = await event.request.formData();
    console.log('Form data', data);

    //TODO: Validate form data
    if (true) {
        let userDoc = (await db.collection('users').doc(token.uid).get()).data() as User;
        username = userDoc.details?.fullName;
        let project = data.get('project') as string;

        let article = {
            authorUID: token.uid,
            authorName: username,
            text: sanitizeMarkdown(data.get('text') as string),
            time: currentTimeInCopenhagen,
            title: data.get('title') as string,
        };

        try {
            const articleRef = await admin.firestore().collection('articles').doc(project).collection('posts').add(article);
            // Send notifications to subscribers of articles
            sendNotifications(firebaseToken, article.title,
                (`
                 <html>
                     <body>
                         <h1>New Article</h1>
                         <h2>Title: ${article.title}</h2>
                         <h3>Author: ${article.authorName}</h3>
                         <a href="https://intranet.fdca.dk/artikler/${project}/${articleRef.id}">View post</a>
                     </body>
                 </html>
         `), project, "all");

        } catch (error) {
            console.error('Failed to create article:', error);
            return new Response(JSON.stringify({ error: 'Failed to create article' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } else {
        return new Response(JSON.stringify("Error"), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }


    return json({ success: true });
}