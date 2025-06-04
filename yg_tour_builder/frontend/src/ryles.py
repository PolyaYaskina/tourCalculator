import math

RULES = {
    "Tundra": {
        "key": "Джип Tundra (6 шт)",
        "unit": "машина",
        "calc": lambda people: math.ceil(people / 3),
    },
    "ГАЗ-69": {
        "key": "Газ 69 (в наличии 3 шт)",
        "unit": "машина",
        "calc": lambda people: 1 if people <= 10 else 2 if people <= 20 else 3,
    },
    "Обед в шатре": {
        "composite": True,
        "components": [
            {"key": "Повар", "label": "Шеф-повар", "count": lambda p: 1},
            {"key": "Помощник повара", "label": "Помощник повара", "count": lambda p: math.ceil(p / 10)},
            {"key": "Официант", "label": "Официант", "count": lambda p: math.ceil(p / 10)},
            {"key": "Машина-кухня", "label": "Машина-кухня", "count": lambda p: 1},
            {"key": "Организация сан зоны (теплый туалет)", "label": "Санзона", "count": lambda p: 1},
            {"key": "Организация обедов на льду и пикников, кейтеринг", "label": "Обед", "count": lambda p: p},
        ]
    },
    "Баня": {
        "key": "Баня из кедра с купелью",
        "unit": "комплект",
        "calc": lambda people: 1,
        "extras": [
            {
                "condition": lambda people: people > 8,
                "label": "Доп. шале при бане",
                "note": "цена уточняется"
            }
        ]
    },
    "Банщик": {
        "key": "Банщик",
        "unit": "чел",
        "calc": lambda people: 1,
    },
    "Шале": {
        "key": None,
        "unit": "шале",
        "calc": lambda people: math.ceil(people / 2),
        "note": "цена уточняется"
    }
}
