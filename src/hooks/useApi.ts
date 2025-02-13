import { useState } from 'react';
import api from '../services/api';
import type { User } from '../types/api';

// Rankings 인터페이스 정의
interface Ranking {
  id: string;
  username: string;
  accumulated_points: number;
  monthly_points: number;
  ranking: number;
  month: number;
}

// User 관련 훅
export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createUser = async (userData: Omit<User, 'id'>) => {
    try {
      setLoading(true);
      const response = await api.post('/users', userData);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
};

// 랭킹 관련 훅
export const useRankings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [rankings, setRankings] = useState<Ranking[]>([]);

  const getRankings = async () => {
    try {
      setLoading(true);
      const response = await api.get<Ranking[]>('/rank-accounts');
      setRankings(response.data);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getRankings, rankings, loading, error };
};