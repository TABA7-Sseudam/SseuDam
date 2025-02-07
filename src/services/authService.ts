// src/services/authService.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

// 회원가입
export const signUpUser = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Firestore에 사용자 정보 저장
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    displayName,
    role: "user",
    createdAt: new Date().toISOString(),
  });

  return user;
};

// 로그인
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// 로그아웃
export const logoutUser = async () => {
  await signOut(auth);
};

// 사용자 정보 가져오기
export const getUserData = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data() : null;
};
