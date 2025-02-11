// src/types/firebase.ts

import { FieldValue } from 'firebase/firestore';

export interface User {
  uid: string;
  username: string;
  email: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  createdAt: FieldValue; // 변경
  updatedAt: FieldValue; // 필요에 따라 수정
  address?: string;
}
