import os
import sys
import pytest
from httpx import AsyncClient, ASGITransport

# Add backend directory to path for importing main app
BACKEND_DIR = os.path.join(os.path.dirname(__file__), '..', 'yg_tour_builder', 'backend')
sys.path.append(os.path.abspath(BACKEND_DIR))

from main import app

@pytest.mark.asyncio
async def test_generate_markdown():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {"1": {"description": "Test day", "services": ["hotel"]}}
        resp = await ac.post("/generate/markdown", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["markdown"].startswith("##")

@pytest.mark.asyncio
async def test_estimate():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {"1": {"services": ["hotel", "meal"]}}
        resp = await ac.post("/estimate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 120.0
    assert len(data["detail"]) == 2

@pytest.mark.asyncio
async def test_download_excel_and_word():
    payload = {"1": {"services": ["hotel"]}}
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res_xlsx = await ac.post("/download/excel", json=payload)
        res_docx = await ac.post("/download/word", json=payload)
    assert res_xlsx.status_code == 200
    assert res_docx.status_code == 200
    assert res_xlsx.headers["content-type"].startswith(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    assert res_docx.headers["content-type"].startswith(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
