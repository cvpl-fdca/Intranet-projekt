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

// src/routes/api/editComment/+server.ts

const db = admin.firestore();
let errors: string[] = [];

export async function POST(event) {
    const firebaseToken = event.request.headers.get('X-firebase-token');
    if (!firebaseToken) {
        return new Response(JSON.stringify({ error: 'Firebase token not provided' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    let token: DecodedIdToken;

    try {
        console.log('Verifying Firebase token:', firebaseToken);
        token = await admin.auth().verifyIdToken(firebaseToken);
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
    const postId = event.params.postId;
    const commentId = data.get('commentId');
    const newText = data.get('text');
    console.log('Form data 1:', data);

    if (newText === null || commentId === null) {
        errors.push('Comment text is required');
    }

    if (newText !== null && !validator.isLength(newText, { min: 1, max: 1000 })) {
        errors.push('Comment must be between 1 and 1000 characters');
    }

    if (errors.length > 0) {
        return new Response(JSON.stringify({ errors }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const commentRef = db.collection('OpenForum').doc(postId).collection('comments').doc(commentId);
    const commentDoc = await commentRef.get();
    if (!commentDoc.exists) {
        return new Response(JSON.stringify({ error: 'Comment not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const commentData = commentDoc.data();
    if (commentData.authorUID !== token.uid) {
        return new Response(JSON.stringify({ error: 'Unauthorized to edit this comment' }), {
            status: 403,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const currentTimeInCopenhagen = dayjs().tz('Europe/Copenhagen').format();
    await commentRef.update({
        oldComments: admin.firestore.FieldValue.arrayUnion({
            text: commentData.text,
            time: currentTimeInCopenhagen
        }),
        text: newText,
        editedTime: currentTimeInCopenhagen
    });

    return json({ success: true });
}
