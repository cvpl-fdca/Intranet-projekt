import firebaseAdmin from 'firebase-admin';
import { getFirebaseSecret } from './getSecret.server';

let db;

async function initializeFirebase() {
    if (!firebaseAdmin.apps.length) {
        try {
            const firebaseSecret = await getFirebaseSecret();
            const firebaseCredentials = JSON.parse(firebaseSecret.firebaseAccountJson);
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(firebaseCredentials)
            });
            db = firebaseAdmin.firestore();
        } catch (error) {
            console.error('Failed to parse Firebase secret or initialize Firebase:', error);
        }
    }
}

initializeFirebase().catch((error) => {
    console.error('Failed to initialize Firebase');
});

export { db, firebaseAdmin as admin };