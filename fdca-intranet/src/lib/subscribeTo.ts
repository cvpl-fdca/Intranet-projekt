import { getToken, getUid, } from "./login";
import app from "$lib/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";

let db = getFirestore(app);


/**
 * Checks if the user is subscribed to the email list for a specific page and post.
 * 
 * @param {string} page - The page to check.
 * @param {string} post - The post to check (default is 'all').
 * @returns {Promise<boolean>} - A promise that resolves to true if the user is subscribed, false otherwise.
 */
async function isSubscribed(page: string, post: string = 'all'): Promise<boolean> {
    try {
        const uuid = await getUid();
        console.log(`Checking if user is subscribed to page: ${page} and post: ${post} with UUID: ${uuid}`)
        const docRef = doc(db, 'emailList', page, 'posts', post, 'subscribers', uuid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        } else {
            console.log(`No such document for page: ${page} and post: ${post}`);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
}

/**
 * Subscribes to a specific page and post.
 * 
 * @param {string} page - The page to subscribe to.
 * @param {string} post - The post to subscribe to.
 * @returns {Promise<void>} - A promise that resolves when the subscription is successful.
 * @throws {Error} - If an error occurs during the subscription process.
 */
async function subscribeToPost(page: string, post: string) {
    try {
        const token = await getToken();
        const submissionFormData = new FormData();
        submissionFormData.append('page', page);
        submissionFormData.append('post', post);
        console.log(`Subscribing to page: ${page} and post: ${post}`);

        // Append the postID to the URL as a parameter
        const response = await fetch(`/api/notification/subscribe`, {
            method: 'POST',
            headers: {
                'X-firebase-token': token
            },
            body: submissionFormData
        });

        return response;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

/**
 * Unsubscribes from a specific page and post.
 * 
 * @param {string} page - The page to unsubscribe from.
 * @param {string} post - The post to unsubscribe from.
 * @returns {Promise<void>} - A promise that resolves when the unsubscription is successful.
 * @throws {Error} - If an error occurs during the unsubscription process.
 */
async function unsubscribeFromPost(page: string, post: string) {
    try {
        const token = await getToken();
        const submissionFormData = new FormData();
        submissionFormData.append('page', page);
        submissionFormData.append('post', post);
        console.log(`Subscribing to page: ${page} and post: ${post}`);

        // Append the postID to the URL as a parameter
        const response = await fetch(`/api/notification/unsubscribe`, {
            method: 'DELETE',
            headers: {
                'X-firebase-token': token
            },
            body: submissionFormData
        });

        return response;
    } catch (error) {
        console.error('Error:', error.message);
    }
}
/**
 * Subscribes to a specific page for notifications.
 * 
 * @param page - The page to subscribe to.
 * @returns A Promise that resolves to the response from the server.
 */
async function subscribeToPage(page: string) {
    try {
        const token = await getToken();
        const submissionFormData = new FormData();
        submissionFormData.append('page', page);
        submissionFormData.append('post', 'all');

        // Append the postID to the URL as a parameter
        const response = await fetch(`/api/notification/subscribe`, {
            method: 'POST',
            headers: {
                'X-firebase-token': token
            },
            body: submissionFormData
        });

        return response;
    } catch (error) {
        console.error('Error:', error.message);
    }
}


/**
 * Unsubscribes from a specific page.
 * 
 * @param page - The page to unsubscribe from.
 * @returns A Promise that resolves to the response from the server.
 */
async function unsubscribeFromPage(page: string) {
    try {
        const token = await getToken();
        const submissionFormData = new FormData();
        submissionFormData.append('page', page);
        submissionFormData.append('post', 'all');
        
        // Append the postID to the URL as a parameter
        const response = await fetch(`/api/notification/unsubscribe`, {
            method: 'DELETE',
            headers: {
                'X-firebase-token': token
            },
            body: submissionFormData
        });

        return response;
    } catch (error) {
        console.error('Error:', error.message);
    }
}


export { subscribeToPage, subscribeToPost, isSubscribed, unsubscribeFromPage, unsubscribeFromPost};