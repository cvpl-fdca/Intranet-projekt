import { writable } from 'svelte/store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import type { User } from './user';
import app from './firebase'; // Your initialized firebase app

// Get a reference to the Firestore service
const db = getFirestore(app);
let auth = getAuth(app);

// Create a writable store
export const userProfileStore = writable<User | null>(null);

// Subscribe to the auth state change
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);

    // Subscribe to the user's profile document
    const unsubscribe = onSnapshot(doc(db, 'users', uid), (doc) => {
      const userData = doc.data() as User;
      userProfileStore.set(userData);
      console.log(userData); // Print the userData to the console
    });
  } else {
    userProfileStore.set(null);
  }
});