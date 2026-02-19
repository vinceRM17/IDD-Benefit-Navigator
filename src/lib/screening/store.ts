/**
 * Zustand store with persist middleware for screening form state
 * Persists to localStorage so families don't lose progress on browser refresh
 * Results are persisted for 24 hours so they survive page refresh
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FullScreeningData } from './schema';
import { ScreeningResults } from '@/lib/results/types';

const RESULTS_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface ScreeningState {
  currentStep: number;
  formData: Partial<FullScreeningData>;
  results: ScreeningResults | null;
  resultsTimestamp: number | null;
  setStepData: (data: Partial<FullScreeningData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setResults: (results: ScreeningResults) => void;
  areResultsExpired: () => boolean;
  clearResults: () => void;
}

export const useScreeningStore = create<ScreeningState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {},
      results: null,
      resultsTimestamp: null,

      setStepData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
        }));
      },

      nextStep: () => {
        set((state) => ({
          currentStep: Math.min(5, state.currentStep + 1),
        }));
      },

      prevStep: () => {
        set((state) => ({
          currentStep: Math.max(1, state.currentStep - 1),
        }));
      },

      reset: () => {
        set({
          currentStep: 1,
          formData: {},
          results: null,
          resultsTimestamp: null,
        });
      },

      setResults: (results) => {
        set({ results, resultsTimestamp: Date.now() });
      },

      areResultsExpired: () => {
        const { resultsTimestamp } = get();
        if (!resultsTimestamp) return true;
        return Date.now() - resultsTimestamp > RESULTS_TTL_MS;
      },

      clearResults: () => {
        set({ results: null, resultsTimestamp: null });
      },
    }),
    {
      name: 'idd-screening-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
        results: state.results,
        resultsTimestamp: state.resultsTimestamp,
      }),
    }
  )
);
