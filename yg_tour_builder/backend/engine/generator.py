from __future__ import annotations

from typing import Dict, Any, List
from io import BytesIO

from docx import Document
import pandas as pd


def create_word(days: Dict[int, Dict[str, Any]]) -> bytes:
    """Generate a Word document representing the itinerary."""
    doc = Document()
    for day in sorted(days):
        info = days[day]
        doc.add_heading(f"Day {day}", level=1)
        if info.get("description"):
            doc.add_paragraph(info["description"])
        for service in info.get("services", []):
            doc.add_paragraph(service, style="List Bullet")
    buffer = BytesIO()
    doc.save(buffer)
    return buffer.getvalue()


def create_excel(detail: List[Dict[str, Any]]) -> bytes:
    """Generate an Excel file with pricing details."""
    df = pd.DataFrame(detail)
    buffer = BytesIO()
    df.to_excel(buffer, index=False)
    return buffer.getvalue()


