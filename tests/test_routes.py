import os
import sys
import pytest
from httpx import AsyncClient, ASGITransport

# Add project root so `yg_tour_builder` can be imported
PROJECT_ROOT = os.path.join(os.path.dirname(__file__), '..')
sys.path.append(os.path.abspath(PROJECT_ROOT))

from yg_tour_builder.backend.main import app
from yg_tour_builder.backend.engine import calculator

@pytest.mark.asyncio
async def test_generate_markdown():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {"1": {"description": "Test day", "services": ["отель"]}}
        resp = await ac.post("/generate/markdown", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["markdown"].startswith("##")

@pytest.mark.asyncio
async def test_estimate():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {"1": {"services": ["отель", "ужин"]}}
        resp = await ac.post("/estimate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    expected = calculator.calculate_costs(payload)
    assert data["total"] == expected["total"]
    assert len(data["detail"]) == len(expected["detail"])

@pytest.mark.asyncio
async def test_estimate_composite():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {"1": {"services": ["обед"]}}
        resp = await ac.post("/estimate?numPeople=10&season=summer", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    expected = calculator.calculate_costs(payload, num_people=10, season="summer")
    assert data["total"] == expected["total"]
    assert len(data["detail"]) == len(expected["detail"])

@pytest.mark.asyncio
async def test_download_excel_and_word():
    payload = {"1": {"services": ["отель"]}}
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
