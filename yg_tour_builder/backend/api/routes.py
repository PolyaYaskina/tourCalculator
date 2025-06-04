from __future__ import annotations

from fastapi import APIRouter, Request, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse

from engine import parser, calculator, generator

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
