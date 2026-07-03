// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgYKyov3xgBejpTTJi-L3Or2Obc_boYcc",
  authDomain: "school-management-24328.firebaseapp.com",
  projectId: "school-management-24328",
  storageBucket: "school-management-24328.firebasestorage.app",
  messagingSenderId: "497188681675",
  appId: "1:497188681675:web:eb61930c9e671c18dda84e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };