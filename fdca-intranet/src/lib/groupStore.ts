import { writable } from 'svelte/store';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'
import app from './firebase'; // Your initialized firebase app

const db = getFirestore(app);

const createGroupStore = () => {
    const { subscribe, set, update } = writable<any[]>([]);

    const groupsCollection = collection(db, "groups");
    const unsubscribe = onSnapshot(groupsCollection, (snapshot) => {
        let groups: any[] = [];
        snapshot.forEach(doc => {
            groups.push({ id: doc.id, ...doc.data() });
        });
        set(groups);
    });

    return {
        subscribe,
        unsubscribe: () => unsubscribe(),
    };
}

export let groupStore = createGroupStore();