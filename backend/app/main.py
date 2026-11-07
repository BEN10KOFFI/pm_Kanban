import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

DEFAULT_STATIC_DIR = Path(__file__).parent / "static"


def create_app(static_dir: Path | None = None) -> FastAPI:
    application = FastAPI(title="PM Backend", version="0.1.0")

    @application.get("/api/health")
    async def health() -> dict[str, str]:
        return {"status": "ok", "service": "pm-backend"}

    @application.get("/api/hello")
    async def hello() -> dict[str, str]:
        return {"message": "Hello from the PM backend API"}

    frontend_dir = static_dir or Path(os.getenv("PM_STATIC_DIR", DEFAULT_STATIC_DIR))
    if not frontend_dir.is_dir():
        raise RuntimeError(f"Frontend static directory does not exist: {frontend_dir}")

    application.mount(
        "/",
        StaticFiles(directory=frontend_dir, html=True),
        name="frontend",
    )
    return application


app = create_app()
