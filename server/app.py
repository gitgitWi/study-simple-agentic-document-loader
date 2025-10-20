from fastapi import FastAPI
from .main_route import router as main_router

app = FastAPI()
app.include_router(main_router)
