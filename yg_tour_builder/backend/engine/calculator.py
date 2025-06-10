from __future__ import annotations
import yaml
from pathlib import Path
import math
SERVICES_PATH = Path(__file__).parent.parent / "data" / "services.yaml"
def always_1(p): return 1
def per_person(p): return p
def per_10_people(p): return math.ceil(p / 10)
def people_div_3(p): return math.ceil(p / 3)
def people_div_2(p): return math.ceil(p / 2)
def people_steps_10_20(p):
    if p <= 10:
        return 1
    elif p <= 20:
        return 2
    return 3
def fixed(p): return 1

CALCULATORS = {
    "always_1": always_1,
    "per_person": per_person,
    "per_10_people": per_10_people,
    "people_div_3": people_div_3,
    "people_div_2": people_div_2,
    "people_steps_10_20": people_steps_10_20,
    "fixed": fixed,
}
def calculate_service(service, num_people, season):
    calc_fn = CALCULATORS.get(service.get("calc"), lambda _: 1)
    qty = calc_fn(num_people)
    price = service.get(f"{season}Price", 0)
    sum_ = price * qty
    return {
        "label": service.get("label"),
        "key": service.get("key"),
        "qty": qty,
        "price": price,
        "sum": sum_,
        "sumWithNDS": round(sum_ * 1.06),
    }

# def calculate_costs(days: Dict[int, Dict[str, Any]]) -> Dict[str, Any]:
#     """Calculate price estimates for the parsed itinerary."""
#     total = 0.0
#     detail: List[Dict[str, Any]] = []
#     for day, info in sorted(days.items()):
#         for service in info.get("services", []):
#             key = service.lower()
#             price = SERVICE_PRICES.get(key, 0.0)
#             total += price
#             detail.append({"day": day, "service": service, "price": price})
#     return {"total": total, "detail": detail}

def calculate_costs(days, num_people=10, season="winter"):  # можно переопределить
    with open(SERVICES_PATH, encoding="utf-8") as f:
        all_services = yaml.safe_load(f)

    detail = []
    total = 0

    for day_num, day in days.items():
        services = day.get("services", [])
        for key in services:
            svc = next((s for s in all_services if s["key"] == key), None)
            if not svc:
                continue

            if svc.get("composite"):
                # композитная услуга — перебираем компоненты
                for comp in svc.get("components", []):
                    merged = {**comp, **next((s for s in all_services if s["key"] == comp["key"]), {})}
                    qty = CALCULATORS.get(merged.get("calc"), fixed)(num_people)
                    price = merged.get(f"{season}Price", 0)
                    sum_ = price * qty
                    detail.append({
                        "day": int(day_num),
                        "service": merged.get("label", merged.get("key")),
                        "price": price,
                        "qty": qty,
                        "sum": sum_,
                        "sumWithNDS": round(sum_ * 1.06),
                        "note": svc.get("label"),
                    })
                    total += round(sum_ * 1.06)
            else:
                # обычная услуга
                qty = CALCULATORS.get(svc.get("calc"), fixed)(num_people)
                price = svc.get(f"{season}Price", 0)
                sum_ = price * qty
                detail.append({
                    "day": int(day_num),
                    "service": svc.get("label", key),
                    "price": price,
                    "qty": qty,
                    "sum": sum_,
                    "sumWithNDS": round(sum_ * 1.06),
                })
                total += round(sum_ * 1.06)

    return {"detail": detail, "total": total}
