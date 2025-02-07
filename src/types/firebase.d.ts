export interface User {
    uid: string;
    username: string;
    email: string;
    emailVerified: boolean;
    role: 'user' | 'admin';
    createdAt: any;  // Firestore timestamp
    updatedAt: any;
    address?: string;  // 주소 필드 추가
  }
  
  export interface UserSession {
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: any;
    deviceInfo?: {
      ipAddress?: string;
      userAgent?: string;
    };
  }
  
  export interface UserActivityLog {
    userId: string;
    action: string;
    ipAddress: string;
    userAgent: string;
    createdAt: any;
    details?: any;
  }
  
  export interface OAuthAccount {
    userId: string;
    provider: 'google' | 'kakao' | 'github';
    providerId: string;
    email: string;
    profileImage?: string;
    createdAt: any;
    lastLogin: any;
  }
  
  export interface EmailVerification {
    userId: string;
    token: string;
    expiresAt: Date;
    verified: boolean;
    createdAt: any;
  }
  
  export interface PasswordReset {
    userId: string;
    resetToken: string;
    expiresAt: Date;
    createdAt: any;
    used: boolean;
  }
  