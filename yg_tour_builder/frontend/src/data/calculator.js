
export const CALCULATORS = {
  always_1: (p) => 1,
  per_person: (p) => p,
  per_10_people: (p) => Math.ceil(p / 10),
  people_div_3: (p) => Math.ceil(p / 3),
  people_div_2: (p) => Math.ceil(p / 2),
  people_steps_10_20: (p) => {
    if (p <= 10) return 1;
    if (p <= 20) return 2;
    return 3;
  },
  fixed: () => 1
};