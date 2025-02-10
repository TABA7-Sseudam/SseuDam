import { db } from './firebase';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// 기존 authService 유지
export const authService = {
  async register(email: string, password: string, username: string, address: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await user.getIdToken(true);
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      address,
      role: 'user',
      emailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return user;
  },

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async logout() {
    await signOut(auth);
  },

  onAuthStateChange(callback: (user: any) => void) {
    return onAuthStateChanged(auth, callback);
  }
};

// 🔑 여기에 dbService 추가
export const dbService = {
  user_sessions: {
    create: async (uid: string) => {
      await addDoc(collection(db, 'user_sessions'), {
        uid,
        createdAt: serverTimestamp()
      });
    }
  }
};
