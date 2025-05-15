// firebase.js

// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAU6wmIRJyp_c5vyQlOSGiDGhyhIYfhyBc",
  authDomain: "trust-chain-98b07.firebaseapp.com",
  projectId: "trust-chain-98b07",
  storageBucket: "trust-chain-98b07.appspot.com", // ✅ fixed
  messagingSenderId: "487365413084",
  appId: "1:487365413084:web:a03305d85996411805cc19",
  measurementId: "G-PFT1HXCPH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize analytics (optional, only works in browser with HTTPS)
let analytics;
if (typeof window !== "undefined" && window.location.protocol === "https:") {
  analytics = getAnalytics(app);
}

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export modules you'll use
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where
};
