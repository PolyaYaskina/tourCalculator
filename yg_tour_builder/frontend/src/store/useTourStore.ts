// useTourStore.ts
import { create } from "zustand";
import type { ServiceInstance, TourDay, TourDraft } from "../types";

interface DraftState extends TourDraft {
  selectedDayIndex: number;
  scenarioChosen: boolean;
}

interface TourStore {
  draft: DraftState;
  setDraft: (updates: Partial<TourDraft>) => void;
  updateDay: (index: number, updates: Partial<TourDay>) => void;
  setSelectedDayIndex: (index: number) => void;
  setScenarioChosen: (val: boolean) => void;
  reset: () => void;
}

const initialDraft: DraftState = {
  title: "",
  region: "baikal",
  numPeople: 2,
  season: "summer",
  startDate: undefined,
  endDate: undefined,
  description: undefined,
  days: [{ description: "", services: [{ key: "#трансфер" }] }],
  selectedDayIndex: 0,
  scenarioChosen: false,
};

export const useTourStore = create<TourStore>((set) => ({
  draft: initialDraft,

  setDraft: (updates) =>
    set((state) => ({
      draft: { ...state.draft, ...updates },
    })),

  updateDay: (index, updates) =>
    set((state) => {
      const days = [...state.draft.days];
      if (index < 0 || index >= days.length) return state;
      days[index] = { ...days[index], ...updates };
      return {
        draft: {
          ...state.draft,
          days,
        },
      };
    }),

  setSelectedDayIndex: (index) =>
    set((state) => ({
      draft: {
        ...state.draft,
        selectedDayIndex: index,
      },
    })),

  setScenarioChosen: (val) =>
    set((state) => ({
      draft: {
        ...state.draft,
        scenarioChosen: val,
      },
    })),

  reset: () =>
    set(() => ({
      draft: { ...initialDraft },
    })),
}));
