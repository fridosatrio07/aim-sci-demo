from __future__ import annotations

from typing import Any

from app.core.config import settings

try:
    from motor.motor_asyncio import AsyncIOMotorClient
except Exception:  # pragma: no cover - import guard keeps memory mode lightweight
    AsyncIOMotorClient = None  # type: ignore[assignment]


_client: Any | None = None


async def get_database() -> Any | None:
    if settings.database_mode == "memory" or AsyncIOMotorClient is None:
        return None

    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.mongodb_uri, serverSelectionTimeoutMS=1200)
    return _client[settings.mongodb_database]


async def ping_database() -> bool:
    database = await get_database()
    if database is None:
        return settings.database_mode == "memory"

    try:
        await database.command("ping")
        return True
    except Exception:
        return False


async def close_database() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
