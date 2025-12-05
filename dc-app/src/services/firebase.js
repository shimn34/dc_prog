// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYBcWXJ9v9nn1hlbHIOsW0HaJRNCDbM80",
  authDomain: "dc2025-project-a510e.firebaseapp.com",
  projectId: "dc2025-project-a510e",
  storageBucket: "dc2025-project-a510e.firebasestorage.app",
  messagingSenderId: "854171673082",
  appId: "1:854171673082:web:7a97c1ad158f205b12c443"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 機能を export（他のファイルで使えるようにする）
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);