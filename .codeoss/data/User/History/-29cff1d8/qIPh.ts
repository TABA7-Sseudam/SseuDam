import { 
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  export const dbService = {
    // 사용자 관련
    users: {
      async get(userId: string) {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
      },
  
      async update(userId: string, data: any) {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
          ...data,x
          updatedAt: serverTimestamp()
        });
      }
    },
  
    // 활동 로그 관련
    activityLogs: {
      async create(userId: string, action: string, details: any = {}) {
        const logRef = doc(collection(db, 'user_activity_logs'));
        await setDoc(logRef, {
          userId,
          action,
          ...details,
          createdAt: serverTimestamp()
        });
      },
  
      async getByUser(userId: string) {
        const q = query(
          collection(db, 'user_activity_logs'),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
    },
  
    // 이메일 인증 관련
    emailVerifications: {
      async create(userId: string) {
        const verificationRef = doc(collection(db, 'email_verifications'));
        const token = Math.random().toString(36).substr(2);
        await setDoc(verificationRef, {
          userId,
          verificationToken: token,
          verified: false,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: serverTimestamp()
        });
        return token;
      },
  
      async verify(token: string) {
        const q = query(
          collection(db, 'email_verifications'),
          where('verificationToken', '==', token),
          where('verified', '==', false)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return false;
  
        const doc = querySnapshot.docs[0];
        await updateDoc(doc.ref, { verified: true });
        return true;
      }
    }
  };