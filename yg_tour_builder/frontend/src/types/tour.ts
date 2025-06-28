// types.ts

export type ComponentInstance = {
  key: string;
  qty?: number;
  price?: number;
 // calctype:
  season?: "summer" | "winter";
};

export type ServiceInstance = {
  key: string;
  qty?: number;
  price?: number;
//  calctype:
  season?: "summer" | "winter";
  components?: ComponentInstance[];
};

export type TourDay = {
  description: string;
  services: ServiceInstance[];
};

export type TourDraft = {
  title: string;
  region: string;
  numPeople: number;
  season: "summer" | "winter";
  startDate?: string;
  endDate?: string;
  description?: string;
  days: TourDay[];
};
