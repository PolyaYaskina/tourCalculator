// constants.js



export const SERVICE_OPTIONS = [
  {
    key: "#обед",
    label: "Обед в шатре",
    description: "🍽 Обед в тёплом шатре. Горячий чай. Кейтеринг.",
    composite: true,
    components: [
      {
        key: "#повар",
        label: "Повар",
        winterPrice: 25000,
        summerPrice: 25000,
        calc: "fixed"
      },
      {
        key: "#официант",
        label: "Официант",
        winterPrice: 15000,
        summerPrice: 15000,
        calc: "per_10_people"
      },
      {
        key: "#санзона",
        label: "Санитарная зона",
        winterPrice: 35000,
        summerPrice: 10000,
        calc: "always_1"
      },
      {
        key: "#продукты",
        label: "Обед, продукты",
        winterPrice: 7000,
        summerPrice: 7000,
        calc: "per_person"
      },
      {
        key: "#кухня",
        label: "машина-кухня",
        winterPrice: 55000,
        summerPrice: 55000,
        calc: "per_person"
      },
       {
        key: "#шатер",
        label: "надувной шатер",
        winterPrice: 65000,
        summerPrice: 65000,
        calc: "per_person"
      }
    ]
  },
  {
    key: "#баня",
    label: "Баня с купелью",
    description: "🔥 Расслабление в кедровой бане. Купель, банщик, отдых.",
    winterPrice: 270000,
    summerPrice: 270000,
    calc: "fixed",
    composite: true,
    components: [
      {
        key: "#банщик",
        label: "банщик",
        winterPrice: 35000,
        summerPrice: 35000,
        calc: "fixed"
      },
      {
        key: "#шале",
        label: "доп шале",
        winterPrice: 75000,
        summerPrice: 75000,
        calc: "people_div_2"
      }
      ]
  },
  {
    key: "#тундра",
    label: "Трансфер на Tundra",
    description: "🚙 Трансфер по льду на Tundra. До 3 человек в машине.",
    winterPrice: 55000,
    summerPrice: 55000,
    calc: "onePer3"
  },
  {
    key: "#газ69",
    label: "Газ 69",
    description: "🚐 Атмосферная поездка на ретро-джипе ГАЗ-69.",
    winterPrice: 65000,
    summerPrice: 65000,
    calc: "onePer3"
  },

  {
    key: "#завтрак",
    label: "Завтрак",
    description: "☕ Утренний приём пищи с горячими напитками.",
    winterPrice: 3500,
    summerPrice: 3500,
    calc: "perPerson"
  },
  {
    key: "#ужин",
    label: "Ужин",
    description: "🍲 Горячий ужин, сервировка в шатре.",
    winterPrice: 1200,
    summerPrice: 1000,
    calc: "perPerson"
  }
];

export const DESCRIPTION_TEMPLATES = [
  { label: "Завтрак и переезд", value: "🌄 Завтрак в шатре. Переезд в следующую локацию. Размещение." },
  { label: "Прогулка по берегу", value: "🧭 Пешая прогулка вдоль берега. Возможность остановки на фото и отдых." },
  { label: "Катание и обед", value: "🏔 Катание по льду на багги. Обед в тёплом шатре. Горячий чай." },
  { label: "Баня и отдых", value: "🔥 Посещение бани. Расслабление, отдых, ужин." },
  { label: "Вылет / трансфер", value: "🚐 Трансфер в аэропорт. Вылет домой." }
];
