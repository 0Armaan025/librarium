import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQvy2TemKcMxb8gXLt_i68xH2h3fMRB2s",
  authDomain: "librarium-00d.firebaseapp.com",
  projectId: "librarium-00d",
  storageBucket: "librarium-00d.firebasestorage.app",
  messagingSenderId: "1079653539447",
  appId: "1:1079653539447:web:ea2e0865a2562caaa6b072",
  measurementId: "G-3Y2YXCFVG6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

export { app, db, auth };
