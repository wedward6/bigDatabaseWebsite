import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth"; 

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAHZecQtoafZpoB1oMDUW-Nbw9uGr2PQFQ",
  authDomain: "databaseprincipleswebsite.firebaseapp.com",
  databaseURL: "https://databaseprincipleswebsite-default-rtdb.firebaseio.com",
  projectId: "databaseprincipleswebsite",
  storageBucket: "databaseprincipleswebsite.appspot.com",
  messagingSenderId: "464228302093",
  appId: "1:464228302093:web:58b8a42e68b375c809c444",
  measurementId: "G-YDDHYJM11M"
});
const auth = getAuth(firebaseApp);
