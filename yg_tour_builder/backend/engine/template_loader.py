from fastapi import HTTPException
from pathlib import Path
import yaml
from ..models.TourDraft import TourDraft, TourDay
from typing import Optional


def load_template_by_key(template_name: str, region: Optional[str] = None) -> TourDraft:
    if not region:
        raise HTTPException(status_code=400, detail="Регион обязателен")

    base_dir = Path(__file__).parent.parent / "data" / "templates"
    yaml_path = base_dir / region / template_name

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

    return TourDraft(
        title =f"Черновик из шаблона: {template_name}",
        region=region,
        season="summer",  # можно позже анализировать по содержимому
        numPeople=2,
        days=days
    )

