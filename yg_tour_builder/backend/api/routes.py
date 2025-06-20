from __future__ import annotations
import yaml
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import StreamingResponse, FileResponse
from pathlib import Path
from ..engine import parser, calculator, generator
from ..models.TourDraft import TourDraft
from ..engine.grouping import group_services_by_category

router = APIRouter()

TEMPLATES_DIR = Path(__file__).parent.parent / "data" / "templates"
DIRECTIONS_PATH = Path(__file__).parent.parent / "data" / "directions.yaml"

@router.get("/directions")
async def get_directions():
    try:
        with DIRECTIONS_PATH.open("r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        return data.get("directions", {})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка загрузки directions.yaml: {e}")

@router.get("/template/file")
async def get_template_file(file: str):
    base_dir = Path(__file__).parent.parent / "data" / "templates"
    full_path = (base_dir / file).resolve()

    if not str(full_path).startswith(str(base_dir.resolve())):
        raise HTTPException(status_code=403, detail="Недопустимый путь")

    if not full_path.exists():
        raise HTTPException(status_code=404, detail="Файл не найден")

    try:
        with full_path.open("r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        return {"days": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка чтения шаблона: {e}")

@router.post("/generate/markdown")
async def generate_markdown(data: TourDraft):
    result = []
    for day in data.days:
        result.append(f"## День {day.dayNumber}")
        if isinstance(day.description, str) and day.description.strip():
            result.append(day.description.strip())
        for item in day.services:
            readable = item.key.replace("#", "").replace("_", " ").capitalize()
            result.append(f"- {readable}")
        result.append("")
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
async def generate_estimate(data: TourDraft):
    estimate = calculator.calculate_costs(data.dict(), num_people=data.numPeople, season=data.season)
    return estimate

@router.post("/download/word")
async def download_word(data: TourDraft):
    content = generator.create_word(data.dict())
    return StreamingResponse(
        iter([content]),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=itinerary.docx"}
    )

@router.post("/download/excel")
async def download_excel(data: TourDraft):
    try:
        estimate = calculator.calculate_costs(data.dict(), num_people=data.numPeople, season=data.season)
        content = generator.create_excel(estimate["detail"])
        return StreamingResponse(
            iter([content]),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=estimate.xlsx"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/services.yaml")
async def get_services_yaml():
    path = Path(__file__).parent.parent / "data" / "services.yaml"
    return FileResponse(path, media_type="application/x-yaml")

@router.post("/services.yaml")
async def save_services_yaml(request: Request):
    try:
        payload = await request.json()
        path = Path(__file__).parent.parent / "data" / "services.yaml"
        with path.open("w", encoding="utf-8") as f:
            yaml.dump(payload, f, allow_unicode=True)
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/grouped")
def get_grouped_services():
    try:
        path = Path(__file__).parent.parent / "data" / "services.yaml"
        grouped = group_services_by_category(path)
        if not isinstance(grouped, dict):
            raise ValueError("Функция вернула несловарный результат")
        if not any(isinstance(group["items"], list) and group["items"] for group in grouped.values()):
            raise ValueError("Все группы пусты или неправильно сформированы")
        return grouped
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
