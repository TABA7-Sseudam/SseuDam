// src/lib/firebase/db.ts
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  User, 
  UserSession, 
  UserActivityLog, 
  OAuthAccount, 
  EmailVerification, 
  PasswordReset 
} from '@/types/firebase';
import { generateRandomToken } from './utils';

const COLLECTIONS = {
  USERS: 'users',
  SESSIONS: 'sessions',
  PASSWORD_RESETS: 'passwordResets',
  ACTIVITY_LOGS: 'activityLogs',
  OAUTH_ACCOUNTS: 'oauthAccounts',
  EMAIL_VERIFICATIONS: 'emailVerifications'
} as const;

export async function createUser(uid: string, userData: Partial<User>) {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const user: User = {
    uid,
    username: userData.username!,
    email: userData.email!,
    emailVerified: false,
    role: 'user',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    address: userData.address || '',
    ...userData
  };
  await setDoc(userRef, user);
  return user;
}

export async function createSession(userId: string, token: string) {
  const sessionRef = doc(db, COLLECTIONS.SESSIONS, token);
  const session: UserSession = {
    userId,
    token,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: serverTimestamp(),
    deviceInfo: {}
  };
  await setDoc(sessionRef, session);
  return session;
}

export async function logUserActivity(userId: string, action: string, details?: any) {
  const logRef = doc(collection(db, COLLECTIONS.ACTIVITY_LOGS));
  const log: UserActivityLog = {
    userId,
    action,
    ipAddress: '',
    userAgent: '',
    createdAt: serverTimestamp(),
    details
  };
  await setDoc(logRef, log);
}

export async function linkOAuthAccount(
  userId: string, 
  provider: 'google' | 'kakao' | 'github',
  providerId: string,
  email: string,
  profileImage?: string
) {
  const oauthRef = doc(db, COLLECTIONS.OAUTH_ACCOUNTS, `${provider}_${providerId}`);
  const oauthAccount: OAuthAccount = {
    userId,
    provider,
    providerId,
    email,
    profileImage,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  };
  await setDoc(oauthRef, oauthAccount);
  return oauthAccount;
}

export async function createEmailVerification(userId: string) {
  const token = generateRandomToken();
  const verificationRef = doc(db, COLLECTIONS.EMAIL_VERIFICATIONS, token);
  const verification: EmailVerification = {
    userId,
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    verified: false,
    createdAt: serverTimestamp()
  };
  await setDoc(verificationRef, verification);
  return verification;
}

export async function createPasswordReset(userId: string) {
  const token = generateRandomToken();
  const resetRef = doc(db, COLLECTIONS.PASSWORD_RESETS, token);
  const passwordReset: PasswordReset = {
    userId,
    resetToken: token,
    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    createdAt: serverTimestamp(),
    used: false
  };
  await setDoc(resetRef, passwordReset);
  return passwordReset;
}
