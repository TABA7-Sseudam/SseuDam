import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  username: string;
  nickname: string;
  email: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  apartment?: string;
  location?: string;
  points: number;
  recycleCount: number;
  profileImage?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin?: Timestamp;
}

export interface UserSession {
  userId: string;
  token: string;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  deviceInfo: {
    ipAddress: string;
    userAgent: string;
    platform: string;
    lastActivity: Timestamp;
  };
}

export interface UserActivityLog {
  userId: string;
  action: 'login' | 'logout' | 'register' | 'password_reset' | 'email_verification' | 'profile_update' | 'recycle';
  ipAddress: string;
  userAgent: string;
  createdAt: Timestamp;
  details?: {
    recycleType?: string;
    points?: number;
    location?: string;
    success?: boolean;
    errorMessage?: string;
  };
}

export interface RankAccount {
  userId: string;
  nickname: string;
  apartment?: string;
  month: number;
  year: number;
  monthlyPoints: number;
  accumulatedPoints: number;
  ranking: number;
  updatedAt: Timestamp;
}

export interface EmailVerification {
  userId: string;
  email: string;
  verificationToken: string;
  expiresAt: Timestamp;
  verified: boolean;
  createdAt: Timestamp;
  verifiedAt?: Timestamp;
  attempts: number;
}

export interface PasswordReset {
  userId: string;
  email: string;
  resetToken: string;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  used: boolean;
  usedAt?: Timestamp;
  attempts: number;
}

export interface AnalysisResult {
  userId: string;
  points: number;
  successPercent: number;
  earned: number;
  inearned: number;
  material: string;
  createdAt: Timestamp;
  location?: string;
  imageUrl?: string;
}
