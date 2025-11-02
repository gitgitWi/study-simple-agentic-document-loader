from fastapi import APIRouter, FastAPI

from .documents_route import documents_router
from .files_route import files_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(documents_router)
api_v1_router.include_router(files_router)

app = FastAPI(
    title="Document Loader",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)


app.include_router(api_v1_router)
