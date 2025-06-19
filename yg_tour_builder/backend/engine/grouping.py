import yaml
from pathlib import Path
from ..data.categories import CATEGORY_LABELS

def group_services_by_category(yaml_path: Path):
    with yaml_path.open("r", encoding="utf-8") as f:
        raw = yaml.safe_load(f)



    if not raw:
        print("⚠️ Список услуг пуст или не найден")
        return {}

    grouped = {}
    for item in raw:
        cat = item.get("category", "other")
        if cat not in grouped:
            grouped[cat] = {
                "label": CATEGORY_LABELS.get(cat, cat),
                "items": [],
            }
        grouped[cat]["items"].append({
            "key": item["key"],
            "label": item.get("label", item["key"]),
            "price": item.get("price"),
            "composite": item.get("composite", False),
            "season": item.get("season"),
        })

    return grouped
