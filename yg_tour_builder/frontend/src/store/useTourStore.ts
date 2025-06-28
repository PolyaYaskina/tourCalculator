import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ServiceInstance, TourDay, TourDraft } from "../types/tour";

interface DraftState extends TourDraft {
  selectedDayIndex: number;
  scenarioChosen: boolean;
}

interface TourStore {
  draft: DraftState;
  setDraft: (updates: Partial<TourDraft>) => void;
  updateDay: (index: number, updates: Partial<TourDay>) => void;
  removeDay: (index: number) => void;
  addDay: () => void;
  setSelectedDayIndex: (index: number) => void;
  setScenarioChosen: (val: boolean) => void;
  reset: () => void;
  applyTemplate: (template: Partial<TourDraft>) => void;
  addServiceToDay: (dayIndex: number, service: ServiceInstance) => void;
  removeServiceFromDay: (dayIndex: number, serviceIndex: number) => void;
  updateServiceInDay: (dayIndex: number, serviceIndex: number, updates: Partial<ServiceInstance>) => void;
  showEstimate: boolean;
  rightPanelOpen: boolean;
  setShowEstimate: (val: boolean) => void;
  setRightPanelOpen: (val: boolean) => void;
}

const generateEmptyDay = (): TourDay => ({
  description: "",
  services: [{ key: "#трансфер" }],
});

const initialDraft: DraftState = {
  title: "",
  region: "baikal",
  numPeople: 2,
  season: "summer",
  startDate: undefined,
  endDate: undefined,
  description: undefined,
  days: [generateEmptyDay()],
  selectedDayIndex: 0,
  scenarioChosen: false,
};



export const useTourStore = create<TourStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      showEstimate: false,
      rightPanelOpen: false,

      setShowEstimate: (val) =>
        set(() => ({ showEstimate: val })),
      setRightPanelOpen: (val) =>
        set(() => ({ rightPanelOpen: val })),

      setDraft: (updates) =>
        set((state) => ({
          draft: { ...state.draft, ...updates },
        })),

      updateDay: (index, updates) =>
        set((state) => {
          const days = [...state.draft.days];
          if (index < 0 || index >= days.length) return state;
          days[index] = { ...days[index], ...updates };
          return { draft: { ...state.draft, days } };
        }),

      removeDay: (index) =>
        set((state) => {
          const { draft, selectedDayIndex } = state;
          if (draft.days.length === 1) return {}; // нельзя удалить последний день
          const newDays = draft.days.filter((_, i) => i !== index);
          const newIndex =
            selectedDayIndex === index
              ? Math.max(0, index - 1)
              : selectedDayIndex > index
              ? selectedDayIndex - 1
              : selectedDayIndex;
          return {
            draft: { ...draft, days: newDays, selectedDayIndex: newIndex },
          };
        }),

      addDay: () =>
        set((state) => {
          const newDays = [...state.draft.days, generateEmptyDay()];
          return {
            draft: { ...state.draft, days: newDays, selectedDayIndex: newDays.length - 1 },
          };
        }),

      setSelectedDayIndex: (index) =>
        set((state) => ({
          draft: { ...state.draft, selectedDayIndex: index },
        })),

      setScenarioChosen: (val) =>
        set((state) => ({
          draft: { ...state.draft, scenarioChosen: val },
        })),

      reset: () =>
        set(() => ({
          draft: { ...initialDraft },
        })),

      applyTemplate: (template: Partial<TourDraft>) =>
        set(() => {
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

      addServiceToDay: (dayIndex, newService) =>
        set((state) => {
          const days = [...state.draft.days];
          if (dayIndex < 0 || dayIndex >= days.length) return state;
          days[dayIndex] = {
            ...days[dayIndex],
            services: [...days[dayIndex].services, newService],
          };
          return { draft: { ...state.draft, days } };
        }),

      removeServiceFromDay: (dayIndex, serviceIndex) =>
        set((state) => {
          const days = [...state.draft.days];
          if (dayIndex < 0 || dayIndex >= days.length) return state;
          const updatedServices = days[dayIndex].services.filter((_, i) => i !== serviceIndex);
          days[dayIndex] = { ...days[dayIndex], services: updatedServices };
          return { draft: { ...state.draft, days } };
        }),

      updateServiceInDay: (dayIndex, serviceIndex, updates) =>
        set((state) => {
          const days = [...state.draft.days];
          if (dayIndex < 0 || dayIndex >= days.length) return state;
          const services = [...days[dayIndex].services];
          if (serviceIndex < 0 || serviceIndex >= services.length) return state;
          services[serviceIndex] = { ...services[serviceIndex], ...updates };
          days[dayIndex] = { ...days[dayIndex], services };
          return { draft: { ...state.draft, days } };
        }),
    }),
    {
      name: "tour-storage", // ключ в localStorage
      partialize: (state) => ({
        draft: state.draft,
        showEstimate: state.showEstimate,
        rightPanelOpen: state.rightPanelOpen,
    }),
    }
  )
);
