export const RULES = {
  "Организация сан зоны (теплый туалет) (зависит от кол-ва дней и чел)": {
    "key": "Организация сан зоны (теплый туалет) (зависит от кол-ва дней и чел)",
    "summerPrice": 10000,
    "winterPrice": 35000,
    "unit": "услуга",
    "calc": "fixed"
  },
  "Обед/ужин, с человека": {
    "key": "Обед/ужин, с человека",
    "summerPrice": 7000,
    "winterPrice": 7000,
    "unit": "услуга",
    "calc": "fixed"
  },
  "Помощник повара": {
    "key": "Помощник повара",
    "summerPrice": 15000,
    "winterPrice": 15000,
    "unit": "услуга",
    "calc": "fixed"
  },
  "Баня из кедра с купелью": {
    "key": "Баня из кедра с купелью",
    "summerPrice": null,
    "winterPrice": 270000,
    "unit": "услуга",
    "calc": "fixed"
  },
  "Газ 69 (в наличии 2 шт)": {
    "key": "Газ 69 (в наличии 2 шт)",
    "summerPrice": 65000,
    "winterPrice": null,
    "unit": "услуга",
    "calc": "people_steps_10_20"
  },
  "Официант": {
    "key": "Официант",
    "summerPrice": 15000,
    "winterPrice": 15000,
    "unit": "услуга",
    "calc": "fixed"
  },
  "Шале (в наличии 4 шт, до 16 человек)": {
    "key": "Шале (в наличии 4 шт, до 16 человек)",
    "summerPrice": 75000,
    "winterPrice": 75000,
    "unit": "услуга",
    "calc": "fixed"
  },
  "Банщик": {
    "key": "Банщик",
    "summerPrice": 35000,
    "winterPrice": 35000,
    "unit": "услуга",
    "calc": "fixed"
  },
  "Машина-кухня": {
    "key": "Машина-кухня",
    "summerPrice": 55000,
    "winterPrice": 55000,
    "unit": "услуга",
    "calc": "fixed"
  },
  "Баня из кедра с купелью и предбанников": {
    "key": "Баня из кедра с купелью и предбанников",
    "summerPrice": 270000,
    "winterPrice": null,
    "unit": "услуга",
    "calc": "fixed"
  },
  "Завтрак, с человека": {
    "key": "Завтрак, с человека",
    "summerPrice": 3500,
    "winterPrice": 3000,
    "unit": "услуга",
    "calc": "fixed"
  },
  "Повар": {
    "key": "Повар",
    "summerPrice": 25000,
    "winterPrice": 25000,
    "unit": "услуга",
    "calc": "fixed"
  },
  "Джип Tundra (6 шт)": {
    "key": "Джип Tundra (6 шт)",
    "summerPrice": 55000,
    "winterPrice": 55000,
    "unit": "услуга",
    "calc": "people_div_3"
  },
  "Обед в шатре": {
    "composite": true,
    "components": [
      {
        "key": "Повар",
        "label": "Шеф-повар",
        "count": "always_1"
      },
      {
        "key": "Помощник повара",
        "count": "per_10_people"
      },
      {
        "key": "Официант",
        "count": "per_10_people"
      },
      {
        "key": "Машина-кухня",
        "count": "always_1"
      },
      {
        "key": "Организация сан зоны (теплый туалет) (зависит от кол-ва дней и чел)",
        "count": "always_1"
      },
      {
        "key": "Обед/ужин, с человека",
        "count": "per_person"
      }
    ]
  },
  "Баня": {
    "key": "Баня из кедра с купелью",
    "unit": "комплект",
    "calc": "always_1",
    "summerPrice": null,
    "winterPrice": 270000,
    "extras": [
      {
        "condition": "people > 8",
        "label": "Доп. шале при бане",
        "note": "цена уточняется"
      }
    ]
  }
};