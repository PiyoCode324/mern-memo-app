// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // ← 追加

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhRmMtrtN3Vyhh9ZO1WJLKy_Qb2RXSdmA",
  authDomain: "mern-memo-app-df006.firebaseapp.com",
  projectId: "mern-memo-app-df006",
  storageBucket: "mern-memo-app-df006.firebasestorage.app", // ← こちらが正しいバケット名
  messagingSenderId: "783073701834",
  appId: "1:783073701834:web:da761c945a7e9b3d0fe933",
  measurementId: "G-V0DW6Z60LM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); // ← 追加

export default app;
