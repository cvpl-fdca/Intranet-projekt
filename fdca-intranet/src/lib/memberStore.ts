import { writable } from 'svelte/store';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'
import app from './firebase'; // Your initialized firebase app
import { onMount } from 'svelte';
import { User } from './user';

const db = getFirestore(app);
//let auth = getAuth(app);

const createMembersStore = () => {
    const {subscribe, set, update } = writable([]);

    const usersCollection = collection(db, "users");

    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
        let members: any[] = [];
        snapshot.forEach(doc => {
            members.push({ id: doc.id, ...doc.data() });
        });
        set(members);
    });

    return {
        subscribe,
        unsubscribe: () => unsubscribe(),
    };
}

export let memberStore = createMembersStore();