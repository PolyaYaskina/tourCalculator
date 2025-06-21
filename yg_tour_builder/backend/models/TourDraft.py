from typing import Literal, Optional
from pydantic import BaseModel
from typing import Union
from pydantic import field_validator
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

# шаблоны для тура
class ComponentInstance(BaseModel):
    key: str
    qty: Optional[int] = None
    price: Optional[int] = None
    season: Optional[Literal["summer", "winter"]] = None

class ServiceInstance(BaseModel):
    key: str  # ссылка на ServiceDefinition
    qty: Optional[int] = None  # количество (например, машин или групп)
    price: Optional[int] = None  # переопределение
    season: Optional[Literal["summer", "winter"]] = None
    components: Optional[list[ComponentInstance]] = None  # если составная — выбранные компоненты

class TourDay(BaseModel):
    description: str
    services: list[ServiceInstance]

    @field_validator("services", mode='before')
    def parse_services(cls, v):
        if isinstance(v, list) and all(isinstance(i, str) for i in v):
            print()
            return [ServiceInstance(key=item) for item in v]
        return v

class TourDraft(BaseModel):
    title: str
    region: str
    numPeople: int
    season: Literal["summer", "winter"]
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    description: Optional[str] = None
    days: list[TourDay]
