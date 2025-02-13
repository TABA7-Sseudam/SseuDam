export interface User {
    id?: string;
    username: string;
    email: string;
    apartment: string;
    location: string;
    nickname: string;
  }
  
  export interface RankAccount {
    id?: string;
    username: string;
    accumulated_points: number;
    monthly_points: number;
    ranking: number;
    month: number;
  }