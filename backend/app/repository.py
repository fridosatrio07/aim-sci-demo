from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from app.db import get_database


REQUIRED_COLLECTIONS = [
    "users",
    "sites",
    "areas",
    "systems",
    "assets",
    "components",
    "documents",
    "extracted_fields",
    "controlled_data",
    "inspection_records",
    "thickness_measurements",
    "corrosion_circuits",
    "failure_events",
    "maintenance_events",
    "rbi_assessments",
    "reliability_results",
    "simulation_runs",
    "anomaly_results",
    "calculation_runs",
    "audit_logs",
]

_memory_store: dict[str, dict[str, dict[str, Any]]] = {name: {} for name in REQUIRED_COLLECTIONS}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _clean(document: dict[str, Any]) -> dict[str, Any]:
    cleaned = dict(document)
    cleaned.pop("_id", None)
    return cleaned


class AimRepository:
    async def _db(self) -> Any | None:
        return await get_database()

    async def ensure_collections(self, names: list[str] | None = None) -> None:
        names = names or REQUIRED_COLLECTIONS
        database = await self._db()
        if database is None:
            for name in names:
                _memory_store.setdefault(name, {})
            return

        existing = set(await database.list_collection_names())
        for name in names:
            if name not in existing:
                await database.create_collection(name)

    async def list_all(self, collection: str) -> list[dict[str, Any]]:
        database = await self._db()
        if database is None:
            return [deepcopy(item) for item in _memory_store.setdefault(collection, {}).values()]

        items = await database[collection].find({}).to_list(length=None)
        return [_clean(item) for item in items]

    async def find_one(self, collection: str, query: dict[str, Any]) -> dict[str, Any] | None:
        database = await self._db()
        if database is None:
            for item in _memory_store.setdefault(collection, {}).values():
                if all(item.get(key) == value for key, value in query.items()):
                    return deepcopy(item)
            return None

        item = await database[collection].find_one(query)
        return _clean(item) if item else None

    async def find_asset(self, asset_id: str) -> dict[str, Any] | None:
        return (
            await self.find_one("assets", {"id": asset_id})
            or await self.find_one("assets", {"tag_number": asset_id})
        )

    async def upsert_many(self, collection: str, documents: list[dict[str, Any]], key: str = "id") -> int:
        database = await self._db()
        if database is None:
            bucket = _memory_store.setdefault(collection, {})
            for document in documents:
                bucket[str(document[key])] = deepcopy(document)
            return len(documents)

        for document in documents:
            await database[collection].replace_one({key: document[key]}, document, upsert=True)
        return len(documents)

    async def insert_one(self, collection: str, document: dict[str, Any]) -> dict[str, Any]:
        document = {
            "id": document.get("id", str(uuid4())),
            "created_at": document.get("created_at", utc_now()),
            "updated_at": utc_now(),
            **document,
        }
        database = await self._db()
        if database is None:
            _memory_store.setdefault(collection, {})[str(document["id"])] = deepcopy(document)
            return deepcopy(document)

        await database[collection].insert_one(document)
        return document

    async def update_one(self, collection: str, item_id: str, patch: dict[str, Any]) -> dict[str, Any] | None:
        patch = {**patch, "updated_at": utc_now()}
        database = await self._db()
        if database is None:
            bucket = _memory_store.setdefault(collection, {})
            item = bucket.get(item_id)
            if item is None:
                return None
            item.update(deepcopy(patch))
            return deepcopy(item)

        await database[collection].update_one({"id": item_id}, {"$set": patch})
        return await self.find_one(collection, {"id": item_id})

    async def filter_by_asset(self, collection: str, asset_id: str) -> list[dict[str, Any]]:
        items = await self.list_all(collection)
        return [item for item in items if item.get("asset_id") == asset_id or item.get("asset_tag") == asset_id]

    async def append_audit(self, action: str, entity: str, entity_id: str, detail: dict[str, Any]) -> None:
        await self.insert_one(
            "audit_logs",
            {
                "action": action,
                "entity": entity,
                "entity_id": entity_id,
                "detail": detail,
                "actor": "prototype-superadmin",
            },
        )
