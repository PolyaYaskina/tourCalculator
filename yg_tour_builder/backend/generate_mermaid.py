from pydantic import BaseModel
from typing import get_args, get_origin
import inspect

from pathlib import Path
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
import models

# sys.path.append(str(Path(__file__).resolve().parent / "models"))
# print("DEBUG: models =", dir(models))
def render_model(model: BaseModel) -> str:
    lines = []
    lines.append(f"class {model.__name__} {{")
    for name, field in model.model_fields.items():
        type_ = field.annotation
        origin = get_origin(type_) or type_
        if hasattr(origin, "__name__"):
            type_str = origin.__name__
        elif hasattr(type_, "__name__"):
            type_str = type_.__name__
        else:
            type_str = str(type_)
        lines.append(f"  {type_str} {name}")
    lines.append("}")
    return "\n".join(lines)

def main():
    print("```mermaid")
    print("classDiagram")
    for name, obj in inspect.getmembers(models):
        if inspect.isclass(obj) and issubclass(obj, BaseModel) and obj is not BaseModel:
            print(render_model(obj))
    print("```")

if __name__ == "__main__":
    sys.exit(main())
