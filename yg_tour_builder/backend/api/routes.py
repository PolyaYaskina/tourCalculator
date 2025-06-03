from fastapi import APIRouter, Request

router = APIRouter()


@router.post("/generate/markdown")
async def generate_markdown(request: Request):
    data = await request.json()  # {"1": {"description": "...", "services": [...]}, ...}

    result = []
    for day, content in data.items():
        result.append(f"## День {day}")
        if content.get("description"):
            result.append(content["description"].strip())
        for item in content.get("services", []):
            readable = item.replace("#", "").replace("_", " ").capitalize()
            result.append(f"- {readable}")
        result.append("")  # пустая строка = перенос

    return {"markdown": "\n".join(result)}
