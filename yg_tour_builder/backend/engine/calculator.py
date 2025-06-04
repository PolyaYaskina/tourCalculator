from __future__ import annotations

from typing import Dict, Any, List

from .rules import SERVICE_PRICES


def calculate_costs(days: Dict[int, Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate price estimates for the parsed itinerary."""
    total = 0.0
    detail: List[Dict[str, Any]] = []
    for day, info in sorted(days.items()):
        for service in info.get("services", []):
            key = service.lower()
            price = SERVICE_PRICES.get(key, 0.0)
            total += price
            detail.append({"day": day, "service": service, "price": price})
    return {"total": total, "detail": detail}
