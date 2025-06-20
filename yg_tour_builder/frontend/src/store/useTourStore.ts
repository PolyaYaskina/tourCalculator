import { create } from "zustand";

type TourDay = {
  description: string;
  services: string[];
};

type TourState = {
  title: string;
  region: string;
  numPeople: number;
  startDate: string;
  endDate: string;
  days: TourDay[];
  selectedDayIndex: number;
  scenarioChosen: boolean;

  setTitle: (val: string) => void;
  setRegion: (val: string) => void;
  setNumPeople: (val: number) => void;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  setScenarioChosen: (val: boolean) => void;

  setDays: (days: TourDay[]) => void;
  updateDay: (index: number, modifier: Partial<TourDay>) => void;
  setSelectedDayIndex: (index: number) => void;
};

export const useTourStore = create<TourState>((set) => ({
  title: "",
  region: "baikal",
  numPeople: 2,
  startDate: "",
  endDate: "",
  days: [{ description: "", services: ["#трансфер"] }],
  selectedDayIndex: 0,
  scenarioChosen: false,

  setTitle: (val) => set({ title: val }),
  setRegion: (val) => set({ region: val }),
  setNumPeople: (val) => set({ numPeople: val }),
  setStartDate: (val) => set({ startDate: val }),
  setEndDate: (val) => set({ endDate: val }),
  setScenarioChosen: (val) => set({ scenarioChosen: val }),

  setDays: (days) => set({ days }),
  updateDay: (index, modifier) =>
    set((state) => {
      const newDays = [...state.days];
      newDays[index] = { ...newDays[index], ...modifier };
      return { days: newDays };
    }),
  setSelectedDayIndex: (index) => set({ selectedDayIndex: index }),
}));
