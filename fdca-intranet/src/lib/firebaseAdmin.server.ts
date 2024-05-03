import admin from 'firebase-admin';
import { getFirebaseSecret } from './getSecret.server';

// Initialize Firebase Admin, but only if it hasn't been initialized yet
if (!admin.apps.length) {
    getFirebaseSecret().then((firebaseSecret) => {
        try {
            const firebaseCredentials = JSON.parse(firebaseSecret.firebaseAccountJson);
            admin.initializeApp({
                credential: admin.credential.cert(firebaseCredentials)
            });
        } catch (error) {
            console.error('Failed to parse Firebase secret or initialize Firebase:', error);
        }
    }).catch((error) => {
        console.error('Failed to retrieve Firebase secret:', error);
    });
}

export { admin };