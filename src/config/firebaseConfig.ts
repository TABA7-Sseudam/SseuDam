// src/config/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzth5hLkD3hSX4Vd8LBagD9F6UYHt1FvQ",
  authDomain: "recyling-3225a.firebaseapp.com",
  databaseURL:"https://recyling-3225a-default-rtdb.firebaseio.com",
  projectId: "recyling-3225a",
  storageBucket: "recyling-3225a.firebasestorage.app",
  messagingSenderId: "232594865059",
  appId: "1:232594865059:web:394a5598b53fa2a8b23816",
  measurementId: "G-Z9WB57W9FW"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
