// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// PASTE YOUR CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyARkYgZF9GNDqba8IMB2JN-DSqv_aCw1l4",
  authDomain: "sudokuapp-21dd2.firebaseapp.com",
  projectId: "sudokuapp-21dd2",
  storageBucket: "sudokuapp-21dd2.firebasestorage.app",
  messagingSenderId: "52067324744",
  appId: "1:52067324744:web:6a3a66e8ace33d431c197d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };