import * as admin from 'firebase-admin';

export const createUser = (user: { uid: any; }) => {
    const uid = user.uid;

    // Define the User object as per the class structure you provided
    const newUser = {
        details: {
            discordName: "",
            email: {
                fdca: "",
                private: "",
                work: ""
            },
            fullName: "",
            phone: {
                private: "",
                work: ""
            }
        },
        roles: {
            isAdmin: false,
            isMember: false,
            projects: {
                sagalabs: false,
                soMe: false
            },
        },
        uid: uid
    };

    // Write the User object to Firestore
    const db = admin.firestore();
    return db.collection('users').doc(uid).set(newUser);
};
