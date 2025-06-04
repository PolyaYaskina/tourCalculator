from __future__ import annotations

from typing import Dict, List, Any
import re

from docx import Document


def parse_word(path: str) -> Dict[int, Dict[str, Any]]:
    """Parse a Word document and extract itinerary data.

    The parser expects sections starting with "Day N" or "День N" headings.
    Everything until the next heading is treated as that day's description
    with bullet list paragraphs interpreted as services.
    """
    doc = Document(path)
    days: Dict[int, Dict[str, Any]] = {}
    current_day: int | None = None
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
        match = re.match(r"(?:Day|День)\s*(\d+)", text, re.IGNORECASE)
        if match:
            current_day = int(match.group(1))
            days[current_day] = {"description": "", "services": []}
            continue
        if current_day is None:
            continue
        if para.style.name.lower().startswith("list") or text.startswith("-") or text.startswith("•"):
            days[current_day]["services"].append(text.lstrip("-• "))
        else:
            if days[current_day]["description"]:
                days[current_day]["description"] += " " + text
            else:
                days[current_day]["description"] = text
    return days
