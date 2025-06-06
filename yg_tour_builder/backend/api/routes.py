from __future__ import annotations

from fastapi import APIRouter,  UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
from pathlib import Path

from ..engine import parser, calculator, generator

router = APIRouter()


from fastapi import Request, APIRouter
from fastapi.responses import JSONResponse


@router.post("/generate/markdown")
async def generate_markdown(request: Request):
    # 🔹 Пытаемся прочитать JSON из тела запроса
    try:
        data = await request.json()  # Ожидаем словарь вида {"1": {"description": "...", "services": [...]}, ...}
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": f"Invalid JSON: {str(e)}"})

    result = []  # 🔸 Список строк, из которых соберётся Markdown

    # 🔹 Проходим по всем дням тура
    for day, content in data.items():
        result.append(f"## День {day}")  # Заголовок дня

        # 🔸 Обрабатываем описание, если оно есть и это строка
        desc = content.get("description")
        if isinstance(desc, str) and desc.strip():
            result.append(desc.strip())

        # 🔸 Обрабатываем список услуг
        services = content.get("services", [])
        if not isinstance(services, list):
            services = []

        for item in services:
            # Убираем технические символы, делаем человекочитаемый текст
            readable = item.replace("#", "").replace("_", " ").capitalize()
            result.append(f"- {readable}")

        result.append("")  # 🔹 Пустая строка = разрыв между днями

    # 🔹 Возвращаем готовый markdown-текст
    return {"markdown": "\n".join(result)}



@router.post("/itinerary/upload")
async def upload_itinerary(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".docx"):
        raise HTTPException(status_code=400, detail="Only .docx files are supported")
    contents = await file.read()
    tmp_path = "/tmp/uploaded.docx"
    with open(tmp_path, "wb") as f:
        f.write(contents)
    days = parser.parse_word(tmp_path)
    return {"days": days}


@router.post("/estimate")
async def generate_estimate(request: Request):
    days = await request.json()
    estimate = calculator.calculate_costs(days)
    return estimate


@router.post("/download/word")
async def download_word(request: Request):
    days = await request.json()
    content = generator.create_word(days)
    return StreamingResponse(iter([content]), media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={"Content-Disposition": "attachment; filename=itinerary.docx"})


@router.post("/download/excel")
async def download_excel(request: Request):
    days = await request.json()
    estimate = calculator.calculate_costs(days)
    content = generator.create_excel(estimate["detail"])
    return StreamingResponse(iter([content]), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={"Content-Disposition": "attachment; filename=estimate.xlsx"})
@router.get("/services.yaml")
async def get_services_yaml():
    path = Path(__file__).parent.parent / "data" / "services.yaml"
    return FileResponse(path, media_type="application/x-yaml")