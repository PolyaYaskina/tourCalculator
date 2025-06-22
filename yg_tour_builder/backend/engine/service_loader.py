
from typing import List
from functools import lru_cache
from typing import Any
from pathlib import Path
import yaml
from pydantic import ValidationError

from ..models import (
    ServiceDefinition,
    ServiceComponent,
    ChoiceItem,
    ComponentGroup,
    CompositeElement
)


def load_services_yaml(path: Path) -> list[dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def parse_component(data: dict[str, Any]) -> CompositeElement:
    if "group" in data and "items" in data:
        return ComponentGroup(
            group=data["group"],
            choose=data["choose"],
            items=[ChoiceItem(**item) for item in data["items"]]
        )
    else:
        return ServiceComponent(**data)

def parse_service(raw: dict[str, Any]) -> ServiceDefinition:
    components_data = raw.get("components")
    components: list[CompositeElement] = []

    if components_data:
        for comp in components_data:
            try:
                parsed = parse_component(comp)
                components.append(parsed)
            except ValidationError as e:
                print(f"Ошибка разбора компонента: {e}")
                raise

    return ServiceDefinition(
        key=raw["key"],
        title=raw.get("label", raw["key"]),
        description=raw.get("description"),
        category=raw.get("category"),
        default_price=raw.get("price"),
        unit=raw.get("calc"),
        tags=None,
        season_specific=raw.get("season") is not None,
        composite=raw.get("composite", False),
        components=components if components else None
    )
@lru_cache()
def parse_all_services(path: Path) -> list[ServiceDefinition]:
    raw_services = load_services_yaml(path)
    return [parse_service(service) for service in raw_services] #test sm


