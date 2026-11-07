from html.parser import HTMLParser
from pathlib import Path

from fastapi.testclient import TestClient

from app.main import create_app


ROOT_DIR = Path(__file__).resolve().parents[2]
FRONTEND_EXPORT_DIR = ROOT_DIR / "frontend" / "out"


class StaticAssetParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.assets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        asset = attributes.get("src") if tag == "script" else attributes.get("href")
        if asset and asset.startswith("/_next/static/"):
            self.assets.append(asset)


def test_root_serves_static_kanban_page() -> None:
    client = TestClient(create_app(FRONTEND_EXPORT_DIR))

    response = client.get("/")

    assert response.status_code == 200
    assert "Kanban Studio" in response.text
    assert "Backlog" in response.text
    assert response.text.count('data-testid="column-') == 5


def test_root_serves_next_static_assets() -> None:
    client = TestClient(create_app(FRONTEND_EXPORT_DIR))
    html = client.get("/").text
    parser = StaticAssetParser()
    parser.feed(html)

    assert parser.assets
    asset_response = client.get(parser.assets[0])

    assert asset_response.status_code == 200
    assert len(asset_response.content) > 0


def test_backend_api_endpoints_remain_available() -> None:
    client = TestClient(create_app(FRONTEND_EXPORT_DIR))

    assert client.get("/api/health").json() == {
        "status": "ok",
        "service": "pm-backend",
    }
    assert client.get("/api/hello").json() == {
        "message": "Hello from the PM backend API",
    }
