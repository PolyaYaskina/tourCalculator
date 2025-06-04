// rules.js
// Правила расчета услуг и составных блоков для калькулятора

export const RULES = {
  "Tundra": {
    key: "Джип Tundra (6 шт)",
    unit: "машина",
    calc: (people) => Math.ceil(people / 3), // Одна машина на троих
  },

  "ГАЗ-69": {
    key: "Газ 69 (в наличии 3 шт)",
    unit: "машина",
    calc: (people) => {
      if (people <= 10) return 1;
      if (people <= 20) return 2;
      return 3;
    },
  },

  "Обед в шатре": {
    composite: true,
    components: [
      {
        key: "Повар",
        label: "Шеф-повар",
        count: (p) => 1,
      },
      {
        key: "Помощник повара",
        label: "Помощник повара",
        count: (p) => Math.ceil(p / 10),
      },
      {
        key: "Официант",
        label: "Официант",
        count: (p) => Math.ceil(p / 10),
      },
      {
        key: "Машина-кухня",
        label: "Машина-кухня",
        count: (p) => 1,
      },
      {
        key: "Организация сан зоны (теплый туалет)",
        label: "Санзона",
        count: (p) => 1,
      },
      {
        key: "Организация обедов на льду и пикников, кейтеринг",
        label: "Обед",
        count: (p) => p,
      },
    ],
  },

  "Баня": {
    key: "Баня из кедра с купелью",
    unit: "комплект",
    calc: (people) => 1,
    extras: [
      {
        condition: (people) => people > 8,
        label: "Доп. шале при бане",
        note: "цена уточняется",
      },
    ],
  },

  "Банщик": {
    key: "Банщик",
    unit: "чел",
    calc: (people) => 1,
  },

  "Шале": {
    key: null,
    unit: "шале",
    calc: (people) => Math.ceil(people / 2),
    note: "цена уточняется",
  },
};