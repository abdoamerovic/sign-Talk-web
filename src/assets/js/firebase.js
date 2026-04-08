import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7QEh9kbNiV5jGcWRFI-MVJuPjAtlBYqY",
  authDomain: "sign-talk-m.firebaseapp.com",
  projectId: "sign-talk-m",
  storageBucket: "sign-talk-m.firebasestorage.app",
  messagingSenderId: "865628573839",
  appId: "1:865628573839:web:6a749499e9d9f4ff23a0fa",
  measurementId: "G-SY4VXZVGSF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
