// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { PUBLIC_ENVIRONMENT } from '$env/static/public';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfigDevTest = {
    apiKey: "AIzaSyBFCP7zeZFshtIucTQ4FRBXmybmr5t02qs",
    authDomain: "fdca-intranet-dev-test.firebaseapp.com",
    projectId: "fdca-intranet-dev-test",
    storageBucket: "fdca-intranet-dev-test.appspot.com",
    messagingSenderId: "794054948756",
    appId: "1:794054948756:web:5d74fe8cc70564b6230181"
};
const firebaseConfigProd = {
    apiKey: "AIzaSyAGb0zYU7fN48GN3D8dG6Nj2BL4kjXo6uA",
    authDomain: "fdca-intranet-prod.firebaseapp.com",
    projectId: "fdca-intranet-prod",
    storageBucket: "fdca-intranet-prod.appspot.com",
    messagingSenderId: "768815700765",
    appId: "1:768815700765:web:7308719d64f27579639ff4"
};

// Initialize Firebase
console.log(PUBLIC_ENVIRONMENT);
let app:FirebaseApp;
if (PUBLIC_ENVIRONMENT.toLowerCase() == "dev" || PUBLIC_ENVIRONMENT.toLowerCase() == "test") {
    const appDevTest = initializeApp(firebaseConfigDevTest);
    app = appDevTest;
}
else if (PUBLIC_ENVIRONMENT.toLowerCase() == "prod") {
    const appProd = initializeApp(firebaseConfigProd);
    app = appProd;
} else {
    if(typeof window !== 'undefined') {
        alert('environment variable not set!');
    }
    else {
        console.log('environment variable not set!');
    }
}
// @ts-ignore
export default app;