/**
 * Zustand store with persist middleware for screening form state
 * Persists to localStorage so families don't lose progress on browser refresh
 * Results are NOT persisted (sensitive data)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FullScreeningData } from './schema';
import { ScreeningResults } from '@/lib/results/types';

interface ScreeningState {
  currentStep: number;
  formData: Partial<FullScreeningData>;
  isHydrated: boolean;
  results: ScreeningResults | null;
  setStepData: (data: Partial<FullScreeningData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setHydrated: (hydrated: boolean) => void;
  setResults: (results: ScreeningResults) => void;
}

export const useScreeningStore = create<ScreeningState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {},
      isHydrated: false,
      results: null,

      setStepData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
        }));
      },

      nextStep: () => {
        set((state) => ({
          currentStep: Math.min(4, state.currentStep + 1),
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
        });
      },

      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },

      setResults: (results) => {
        set({ results });
      },
    }),
    {
      name: 'idd-screening-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist form data and currentStep, NOT results (sensitive data)
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
        isHydrated: state.isHydrated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
