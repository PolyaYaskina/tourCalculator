from typing import get_args, get_origin, Union
from pydantic import BaseModel
import inspect
import models
import sys

def render_type(annotation):
    origin = get_origin(annotation)
    args = get_args(annotation)

    if origin is Union:
        arg_strs = [render_type(arg) for arg in args if arg is not type(None)]
        if len(arg_strs) == 1:
            return f"{arg_strs[0]}?"
        return f"Union[{', '.join(arg_strs)}]"
    elif origin in (list, List):
        return f"List[{render_type(args[0])}]"
    elif origin in (dict, Dict):
        return f"Dict[{render_type(args[0])}, {render_type(args[1])}]"
    elif hasattr(annotation, "__name__"):
        return annotation.__name__
    elif hasattr(origin, "__name__"):
        return origin.__name__
    return str(annotation)

def render_model(model: BaseModel) -> str:
    lines = [f"class {model.__name__} {{"]

    for name, field in model.model_fields.items():
        type_str = render_type(field.annotation)
        lines.append(f"  {type_str} {name}")
    lines.append("}")
    return "\n".join(lines)

def find_compositions(models_dict):
    relations = []
    for name, cls in models_dict.items():
        if not issubclass(cls, BaseModel) or cls is BaseModel:
            continue
        for field in cls.model_fields.values():
            field_type = field.annotation
            args = get_args(field_type)
            all_args = args if args else (field_type,)
            for arg in all_args:
                if isinstance(arg, type) and issubclass(arg, BaseModel):
                    relations.append((cls.__name__, arg.__name__))
    return relations

def main():
    print("```mermaid")
    print("classDiagram")

    classes = {
        name: obj
        for name, obj in inspect.getmembers(models)
        if inspect.isclass(obj) and issubclass(obj, BaseModel) and obj is not BaseModel
    }

    for cls in classes.values():
        print(render_model(cls))

    for src, dst in find_compositions(classes):
        print(f"{src} --> {dst} : has-a")

    print("```")

if __name__ == "__main__":
    sys.exit(main())
