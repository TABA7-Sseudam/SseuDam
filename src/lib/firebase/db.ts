import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  username: string;
  email: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  address?: string; // Optional
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
  action: "login" | "logout" | "register" | "password_reset" | "email_verification" | "profile_update" | "recycle";
  ipAddress: string;
  userAgent: string;
  createdAt: Timestamp;
  details?: any;
}

export interface EmailVerification {
  userId: string;
  token: string; // 추가
  expiresAt: Timestamp;
  verified: boolean;
  createdAt: Timestamp;
}

export interface PasswordReset {
  userId: string;
  resetToken: string;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  used: boolean;
  email?: string; // 필요에 따라 추가
  attempts?: number; // 필요에 따라 추가
}
