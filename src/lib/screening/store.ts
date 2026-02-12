/**
 * Zustand store with persist middleware for screening form state
 * Persists to localStorage so families don't lose progress on browser refresh
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FullScreeningData } from './schema';

interface ScreeningState {
  currentStep: number;
  formData: Partial<FullScreeningData>;
  isHydrated: boolean;
  setStepData: (data: Partial<FullScreeningData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useScreeningStore = create<ScreeningState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {},
      isHydrated: false,

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
        });
      },

      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'idd-screening-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
