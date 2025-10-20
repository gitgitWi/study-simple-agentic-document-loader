from fastapi import APIRouter

router = APIRouter(prefix="")


@router.get("/")
async def main_route():
    return {"message": "Hello from alan-document-loaders!"}
