import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { db } from './firebase';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

const auth = getAuth();

export const authService = {
  // 회원가입 - location, apartment 추가
  async register(
    email: string, 
    password: string, 
    username: string, 
    address: string,
    location?: string,
    apartment?: string
  ) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 인증 상태 강제 갱신
    await user.getIdToken(true);
    
    // Firestore에 사용자 정보 저장 - location, apartment 기본값 추가
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      address,
      location: location || '정보 없음',
      apartment: apartment || '정보 없음',
      role: 'user',
      emailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return user;
  },

  // 로그인
  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // 로그아웃
  async logout() {
    await signOut(auth);
  },

  // 프로필 업데이트
  async updateProfile(userId: string, data: {
    location?: string;
    apartment?: string;
    username?: string;
    address?: string;
  }) {
    // Firestore 문서 업데이트
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });

    // Firebase Auth 프로필 업데이트 (이름만 가능)
    if (data.username && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: data.username
      });
    }
  },

  // 현재 사용자 상태 감지
  onAuthStateChange(callback: (user: any) => void) {
    return onAuthStateChanged(auth, callback);
  }
};