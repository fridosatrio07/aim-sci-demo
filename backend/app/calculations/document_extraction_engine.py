from __future__ import annotations

from typing import Any


def extract_document_fields(document: dict[str, Any]) -> dict[str, Any]:
    title = document.get("title", "")
    guessed_tag = document.get("asset_tag") or ("V-101" if "V-101" in title else "")
    return {
        "document_id": document["id"],
        "status": "extracted",
        "confidence": 0.86,
        "fields": {
            "tag_number": guessed_tag,
            "document_title": title,
            "revision": document.get("revision", "1.0"),
            "last_updated": document.get("last_updated", document.get("created_at")),
            "source": document.get("source", "Document Upload"),
        },
        "notes": "Prototype extraction uses deterministic filename and metadata parsing.",
    }
