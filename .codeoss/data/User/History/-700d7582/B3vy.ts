import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } from 'firebase/auth';
  import { db } from './firebase';
  import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
  
  const auth = getAuth();
  
  export const authService = {
    // 회원가입
    async register(email: string, password: string, username: string) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
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
  
    // 현재 사용자 상태 감지
    onAuthStateChange(callback: (user: any) => void) {
      return onAuthStateChanged(auth, callback);
    }
  };