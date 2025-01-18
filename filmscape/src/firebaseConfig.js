// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJKpGRtAB4YtZ3YsQRjJL2Dei0IMm-22I",
  authDomain: "filmscape-2d046.firebaseapp.com",
  projectId: "filmscape-2d046",
  storageBucket: "filmscape-2d046.firebasestorage.app",
  messagingSenderId: "103374159392",
  appId: "1:103374159392:web:c9d6e1206284e273938645",
  measurementId: "G-KLJ4C1TVQP"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
