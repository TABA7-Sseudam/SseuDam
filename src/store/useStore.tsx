// src/store/useStore.ts
import { create } from 'zustand'

interface User {
  name: string
  points: number
  co2Reduction: number
}

interface RecyclingStats {
  successRate: number
  totalWeight: number
  lastAnalysis: string
}

interface AppState {
  user: User | null
  stats: RecyclingStats
  setUser: (user: User | null) => void
  updateStats: (stats: Partial<RecyclingStats>) => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  stats: {
    successRate: 90,
    totalWeight: 250,
    lastAnalysis: ''
  },
  setUser: (user) => set({ user }),
  updateStats: (newStats) => 
    set((state) => ({
      stats: { ...state.stats, ...newStats }
    }))
}))