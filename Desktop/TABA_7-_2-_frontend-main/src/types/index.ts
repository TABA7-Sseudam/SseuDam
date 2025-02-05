// src/types/index.ts
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  }
  
  export interface RecyclingRecord {
    id: string;
    userId: string;
    date: string;
    success: boolean;
    imageUrl: string;
    feedback: string;
    co2Reduction: number;
  }
  
  export interface AnalysisResult {
    success: boolean;
    feedback: string;
    confidence: number;
    category: string;
  }