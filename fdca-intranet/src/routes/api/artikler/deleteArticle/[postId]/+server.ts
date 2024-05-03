import { json } from '@sveltejs/kit';
import { admin, db } from '$lib/firebaseAdmin.server.js';
import { type DecodedIdToken } from 'firebase-admin/auth';
import { getUsername } from '$lib/login.js';
import type { User } from '$lib/user.js';



export async function DELETE(event) {
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
        console.log("token: ", token);
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
        // Get the article ID from the request body
        const postId = event.params.postId;
        const data = await event.request.formData();

        const project = data.get('project');

        // Get the article from Firestore
        const articleRef = admin.firestore().collection('articles').doc(project).collection('posts').doc(postId);
        const article = await articleRef.get();

        let userDoc = (await db.collection('users').doc(token.uid).get()).data() as User;
        let projectMember: boolean;
        if(project === 'karkom') {
            projectMember = userDoc.roles.projects.karkom;
        } else if (project === 'strøko') {
            projectMember = userDoc.roles.projects.strøko;
        } else if (project === 'socsam') {
            projectMember = userDoc.roles.projects.socsam;
        } else {projectMember = false;}

        // Check if the user is project member
        if (article.exists && projectMember) {
            console.log("Deleting article");
            // Delete the article
            await articleRef.delete();
            console.log("Article deleted");
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
        console.error('Failed to delete article:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete article' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
