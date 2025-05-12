// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Optionally import Firestore if you're using it

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCojLKjcXAqDUgL6RGK9K5zl6K1eFQSbJI",
  authDomain: "sudokuapp-8f34b.firebaseapp.com",
  projectId: "sudokuapp-8f34b",
  storageBucket: "sudokuapp-8f34b.firebasestorage.app",
  messagingSenderId: "769017647928",
  appId: "1:769017647928:web:db4cc6e543589417f0e7cd",
  measurementId: "G-6LFNM6Q4F8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore (if used)

export { auth, db }; // Export auth and db for use in other files
