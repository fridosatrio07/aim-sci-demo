from dataclasses import dataclass
import os


def _split_csv(value: str) -> tuple[str, ...]:
    return tuple(item.strip() for item in value.split(",") if item.strip())


@dataclass(frozen=True)
class Settings:
    app_name: str = "AIM SCI Demo API"
    env: str = os.getenv("AIM_ENV", "development")
    database_mode: str = os.getenv("AIM_DATABASE_MODE", "mongo").lower()
    mongodb_uri: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    mongodb_database: str = os.getenv("MONGODB_DATABASE", "aim_sci_demo")
    cors_origins: tuple[str, ...] = _split_csv(
        os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
    )


settings = Settings()
