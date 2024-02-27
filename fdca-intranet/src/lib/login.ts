import type { FirebaseApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import app from "$lib/firebase";



var provider = new GoogleAuthProvider();
provider.setCustomParameters({
    hd: "fdca.dk"
});

const auth = getAuth(app);

export default function signIn(app: FirebaseApp): Promise<void> {
    signInWithPopup(auth, provider)
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
        })
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

export { auth, getUsername };