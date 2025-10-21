from pathlib import Path

from fastapi.staticfiles import StaticFiles

STATIC_FILES_DIRECTORY = Path(__file__).resolve().parent.parent / "web/dist"


static_files = StaticFiles(directory=STATIC_FILES_DIRECTORY, html=True)
