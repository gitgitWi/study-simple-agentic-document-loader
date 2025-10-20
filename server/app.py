from fastapi import APIRouter, FastAPI

from .documents_route import router as documents_router

api_router = APIRouter(prefix="/api")
api_router.include_router(documents_router)

app = FastAPI(
    title="Document Loader",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)


app.include_router(api_router)
