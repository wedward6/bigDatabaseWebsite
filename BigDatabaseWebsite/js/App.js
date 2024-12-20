// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHZecQtoafZpoB1oMDUW-Nbw9uGr2PQFQ",
  authDomain: "databaseprincipleswebsite.firebaseapp.com",
  databaseURL: "https://databaseprincipleswebsite-default-rtdb.firebaseio.com",
  projectId: "databaseprincipleswebsite",
  storageBucket: "databaseprincipleswebsite.appspot.com",
  messagingSenderId: "464228302093",
  appId: "1:464228302093:web:58b8a42e68b375c809c444",
  measurementId: "G-YDDHYJM11M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};