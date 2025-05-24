import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace this with your actual Firebase config from the Console
const firebaseConfig = {
    apiKey: 'AIzaSyAhO75J4pYfjIUMUFhNndBtUu9j0Ue8hxQ',
    authDomain: 'timer-156cc.firebaseapp.com',
    projectId: 'timer-156cc',
    storageBucket: 'timer-156cc.firebasestorage.app',
    messagingSenderId: '1078471646302',
    appId: '1:1078471646302:web:afd1174077525c1dff68cf',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { app, auth, db, provider };
