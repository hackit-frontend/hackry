import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC09BH8kwFb6x9qXnV7ZF-WGr7OCe2xKk8",
  authDomain: "hackry-36d99.firebaseapp.com",
  projectId: "hackry-36d99",
  storageBucket: "hackry-36d99.firebasestorage.app",
  messagingSenderId: "578756309021",
  appId: "1:578756309021:web:22e1a6ef32980606ee16f4",
  measurementId: "G-N4D4RCWZ2X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
