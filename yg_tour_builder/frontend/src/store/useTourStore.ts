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
  removeDay: (index: number) => void; // 👈 ДОБАВЛЯЕМ
  addDay: () => void;                // 👈 ДОБАВЛЯЕМ
  setSelectedDayIndex: (index: number) => void;
  setScenarioChosen: (val: boolean) => void;
  reset: () => void;
  applyTemplate: (template: Partial<TourDraft>) => void;
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
const generateEmptyDay = (): TourDay => ({
  description: "",
  services: [{ key: "#трансфер" }],
});



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
  removeDay: (index) =>
    set((state) => {
      const { draft, selectedDayIndex } = state;
      if (draft.days.length === 1) return {}; // не удаляем последний
      const newDays = draft.days.filter((_, i) => i !== index);
      const newIndex =
        selectedDayIndex === index
          ? Math.max(0, index - 1)
          : selectedDayIndex > index
          ? selectedDayIndex - 1
          : selectedDayIndex;

      return {
        draft: { ...draft, days: newDays },
        selectedDayIndex: newIndex,
      };
    }),

  addDay: () =>
    set((state) => {
      const newDays = [...state.draft.days, generateEmptyDay()];
      return {
        draft: { ...state.draft, days: newDays },
        selectedDayIndex: newDays.length - 1,
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

  applyTemplate: (template: Partial<TourDraft>) =>
    set(() => {
        console.log("STORE", template.days);
      if (!Array.isArray(template.days)) {
        console.warn("⚠️ Некорректный шаблон: поле days не массив");
        return {};
      }

      const { selectedDayIndex, scenarioChosen, ...safeTemplate } = template;

      return {
        draft: {
          ...initialDraft,
          ...safeTemplate,
          selectedDayIndex: 0,
          scenarioChosen: false,
        },
      };
    }),
}));
