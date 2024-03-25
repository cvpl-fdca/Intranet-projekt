import admin from 'firebase-admin';
import * as path from 'path';

// Get the path to the JSON file
const jsonFilePath = path.resolve('fdca-intranet-dev-test-firebase-adminsdk-e9ktp-e1032c03a1.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(jsonFilePath)
    });
}

export { admin };
