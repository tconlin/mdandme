// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  serverTimestamp as serverTimestampInstance,
  getFirestore,
} from "firebase/firestore";
import type * as firestore from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIXXfl5xtwLZWPQ6sG9qBWDLMuSeKNBd8",
  authDomain: "mdandme-d177b.firebaseapp.com",
  projectId: "mdandme-d177b",
  storageBucket: "mdandme-d177b.appspot.com",
  messagingSenderId: "60656048698",
  appId: "1:60656048698:web:5393235fee47c582293303",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const getDb: firestore.Firestore = getFirestore(app);
const getServerTimestamp = () => serverTimestampInstance();

export { getServerTimestamp, getDb };
