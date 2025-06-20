export type ComponentInstance = {
  key: string;
  qty: number;
  price: number;
  season?: "summer" | "winter";
};

export type ServiceInstance = {
  key: string;
  season?: "summer" | "winter";
  qty?: number;
  price?: number;
  components?: ComponentInstance[];
};

export type TourDay = {
  dayNumber: number;
  description: string;
  services: ServiceInstance[];
};

export type TourDraft = {
  title: string;
  location: string;
  numPeople: number;
  season: "summer" | "winter";
  startDate?: string;
  endDate?: string;
  description?: string;
  days: TourDay[];
};
