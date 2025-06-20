from typing import Literal, Optional
from pydantic import BaseModel
from typing import Union
class ServiceComponent(BaseModel):
    key: str
    calc: Literal["always_1", "per_person", "per_10_people", "per_car"]
    price: int
    season: Optional[Literal["summer", "winter"]] = None

class ChoiceItem(ServiceComponent):
    pass  # можно расширить в будущем

class ComponentGroup(BaseModel):
    group: str
    choose: Literal["one", "many"]
    items: list[ChoiceItem]



CompositeElement = Union[ServiceComponent, ComponentGroup]

class ServiceDefinition(BaseModel):
    key: str
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    default_price: Optional[int] = None  # Если услуга простая — используется эта цена
    unit: Optional[Literal["per_person", "fixed", "per_car", "per_10_people"]] = None
    tags: Optional[list[str]] = None
    season_specific: Optional[bool] = False
    composite: Optional[bool] = False
    components: Optional[list[CompositeElement]] = None
