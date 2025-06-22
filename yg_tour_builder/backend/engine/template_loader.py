from fastapi import HTTPException
from pathlib import Path
import yaml
from ..models.TourDraft import TourDraft, TourDay, ServiceComponent
from typing import Optional
import os
from ..engine.service_loader import parse_all_services

from ..models import (
    ServiceDefinition,
    ServiceInstance,
    ComponentInstance,
    ComponentGroup
)
PROJECT_ROOT = os.path.join(os.path.dirname(__file__), '..')

def apply_service_definition(
    instance: ServiceInstance,
    definition: ServiceDefinition
) -> ServiceInstance:
    if not definition.composite:
        return ServiceInstance(
            key=instance.key,
            qty=instance.qty,
            price=instance.price or definition.default_price,
            season=instance.season or definition.season
        )

    components: list[ComponentInstance] = []

    for comp in definition.components or []:
        if isinstance(comp, ServiceComponent):
            components.append(ComponentInstance(
                key=comp.key,
                qty=None,
                price=comp.price,
                season=comp.season
            ))
        elif isinstance(comp, ComponentGroup):
            for item in comp.items:
                components.append(ComponentInstance(
                    key=item.key,
                    qty=None,
                    price=item.price,
                    season=item.season
                ))
        else:
            raise TypeError(f"Неизвестный тип компонента: {type(comp)}")

    return ServiceInstance(
        key=instance.key,
        qty=instance.qty,
        price=instance.price or definition.default_price,
        season=instance.season or definition.season,
        components=components
    )


def fill_service_instances(
    days: list[TourDay],
    service_defs: list[ServiceDefinition]
) -> list[TourDay]:
    service_map = {s.key: s for s in service_defs}
    enriched_days = []

    for day in days:
        enriched_services = []

        for svc in day.services:
            definition = service_map.get(svc.key)
            if not definition:
                raise ValueError(f"Не найдена услуга с ключом: {svc.key}")

            enriched = apply_service_definition(svc, definition)
            enriched_services.append(enriched)

        enriched_days.append(
            TourDay(description=day.description, services=enriched_services)
        )

    return enriched_days

#делаем загрузку из файла, рендерим базу данных, сопоставляем все из одного в другое

def load_template_by_key(template_name: str, region: Optional[str] = None) -> TourDraft:
    if not region:
        raise HTTPException(status_code=400, detail="Регион обязателен")

    base_dir = Path(__file__).parent.parent / "data" / "templates"
    yaml_path = base_dir / region / template_name

    path = Path(__file__).parent.parent / "data" / "services.yaml"

    service_defs = parse_all_services(path)
    print("AAAAA", service_defs)
    if not yaml_path.exists():
        raise HTTPException(status_code=404, detail="Файл шаблона не найден")

    try:
        with yaml_path.open("r", encoding="utf-8") as f:
            raw_days = yaml.safe_load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при чтении YAML: {e}")

    try:
        days = [TourDay(**day) for day in raw_days]
        print("из YAML!", days)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка валидации данных: {e}")
    try:
        filled_days = fill_service_instances(days, service_defs)
        print("AAAAA2",filled_days)
    except Exception as e:
        raise HTTPException(status_code=900, detail=f"бблабла]: {e}")

    return TourDraft(
        title =f"Черновик из шаблона: {template_name}",
        region=region,
        season="summer",  # можно позже анализировать по содержимому
        numPeople=2,
        days=filled_days
    )

