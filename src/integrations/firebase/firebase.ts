// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU6wmIRJyp_c5vyQlOSGiDGhyhIYfhyBc",
  authDomain: "trust-chain-98b07.firebaseapp.com",
  projectId: "trust-chain-98b07",
  storageBucket: "trust-chain-98b07.firebasestorage.app",
  messagingSenderId: "487365413084",
  appId: "1:487365413084:web:a03305d85996411805cc19",
  measurementId: "G-PFT1HXCPH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, db, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where };
