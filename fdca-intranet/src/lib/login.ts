import type { FirebaseApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import app from "$lib/firebase";
import { PUBLIC_ENVIRONMENT } from '$env/static/public';

var provider = new GoogleAuthProvider();

// Only allow users from fdca.dk to sign in, if not in dev or test environment
if (PUBLIC_ENVIRONMENT.toLowerCase() !== "dev" && PUBLIC_ENVIRONMENT.toLowerCase() !== "test") {
    provider.setCustomParameters({
        hd: "fdca.dk"
    });
}

const auth = getAuth(app);

export default function signIn(): Promise<void> {
    return signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.errorMessage;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
    console.log(auth.currentUser?.displayName);
}

function getUsername(): Promise<string | null> {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user.email);
            } else {
                resolve(null);
            }
        });
    });
}

function logout(): Promise<void> {
    return signOut(auth);
}

function getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                user.getIdToken().then((token) => {
                    resolve(token);
                });
            } else {
                reject("No user logged in");
            }
        });
    });
}

export { auth, getUsername, logout, getToken};