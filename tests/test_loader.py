import os
import sys
import pytest
from pathlib import Path
# Добавим путь к проекту
PROJECT_ROOT = os.path.join(os.path.dirname(__file__), '..')
sys.path.append(os.path.abspath(PROJECT_ROOT))

from yg_tour_builder.backend.engine.service_loader import load_services_yaml,parse_all_services, ServiceDefinition, ComponentGroup

def test_parse_services_yaml_success():
    # путь до файла с test-данными (можно сделать фикстурой или mock-файлом)
    yaml_path = Path(PROJECT_ROOT) / "yg_tour_builder" / "backend" / "data" / "services.yaml"
    result = parse_all_services(yaml_path)

    assert isinstance(result, list)
    assert all(isinstance(item, ServiceDefinition) for item in result)

    # найдём конкретную услугу и проверим вложенные компоненты
    lunch = next((s for s in result if s.key == "обед"), None)
    assert lunch is not None
    assert lunch.composite is True
    assert lunch.components is not None

    # проверим, что есть ComponentGroup
    group_found = any(isinstance(c, ComponentGroup) for c in lunch.components)
    assert group_found

    # пример: убедиться, что "повар" — обычный компонент, а не группа
    cook = next((c for c in lunch.components if isinstance(c, dict) is False and getattr(c, "key", "") == "повар"), None)
    assert cook is not None
    assert cook.price == 25000

def test_parse_invalid_yaml_raises_error(tmp_path):
    bad_yaml = tmp_path / "bad.yaml"
    bad_yaml.write_text(":- just: bad: yaml")  # некорректный синтаксис

    with pytest.raises(Exception):
        load_services_yaml(str(bad_yaml))



# Добавляем путь к корню проекта
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.append(str(PROJECT_ROOT))

from yg_tour_builder.backend.engine.template_loader import load_template_by_key
from yg_tour_builder.backend.models import TourDraft, TourDay, ServiceInstance

@pytest.fixture
def setup_template_file(tmp_path):
    """Создаёт временный YAML-шаблон тура"""
    template_dir = tmp_path / "data" / "templates" / "baikal"/"test_region"
    template_dir.mkdir(parents=True)

    template_content = """
- description: "Тестовый день"
  services:
    - отель
    - баня
"""

    template_path = template_dir / "test_template.yaml"
    template_path.write_text(template_content, encoding="utf-8")

    # Копируем оригинальный services.yaml в tmp_path
    original_services = PROJECT_ROOT / "yg_tour_builder" / "backend" / "data" / "services.yaml"
    target_services = tmp_path / "data" / "services.yaml"
    target_services.parent.mkdir(parents=True, exist_ok=True)
    target_services.write_text(original_services.read_text(), encoding="utf-8")

    # Подменяем базовую директорию в модуле
    from yg_tour_builder.backend.engine import template_loader
    template_loader.Path = lambda: tmp_path  # monkeypatch

    return tmp_path

def test_load_template_success():
    """Проверяет, что шаблон успешно загружается и обогащается"""

    draft = load_template_by_key("/Users/polinayaskina/PycharmProjects/yg_tour_builder_fastapi_react/yg_tour_builder/backend/data/templates/baikal/empty.yaml", region="baikal")

    assert isinstance(draft, TourDraft)
    assert draft.title.startswith("Черновик из шаблона")
    assert draft.region == "test_region"
    assert len(draft.days) == 1

    day = draft.days[0]
    assert isinstance(day, TourDay)
    assert day.description == "Тестовый день"

    assert all(isinstance(svc, ServiceInstance) for svc in day.services)
    assert all(svc.price is not None for svc in day.services)
    assert any(svc.components for svc in day.services if svc.key == "баня")
