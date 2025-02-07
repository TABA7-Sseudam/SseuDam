import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 디버그 로그 추가: 환경 변수 값 확인
console.log("✅ Firebase API Key:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log("✅ Firebase Auth Domain:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log("✅ Firebase Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("✅ Firebase Storage Bucket:", import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
console.log("✅ Firebase Messaging Sender ID:", import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
console.log("✅ Firebase App ID:", import.meta.env.VITE_FIREBASE_APP_ID);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore와 Auth 초기화
export const db = getFirestore(app);
export const auth = getAuth(app);
