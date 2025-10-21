from typing import List

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, HttpUrl, field_validator

from features.document_loaders import HWPLoader
from features.document_loaders.file_extensions import (
    AllowedExtension,
    is_valid_extension,
)

documents_router = APIRouter()


class DocumentLoadRequest(BaseModel):
    file_url: HttpUrl | str = Field(..., description="File path")
    file_extension: str = Field(
        ...,
        description="File extension",
    )

    @field_validator("file_extension")
    @classmethod
    def validate_file_extension(cls, v: str) -> str:
        if not is_valid_extension(v):
            raise ValueError(f"Invalid file extension: .{v}")
        return v


class LoadedDocument(BaseModel):
    page_content: str
    page_number: int


class DocumentLoadResponse(BaseModel):
    documents: List[LoadedDocument]


@documents_router.post("/documents", response_model=DocumentLoadResponse)
async def documents_route(req: DocumentLoadRequest):
    local_file_path = await _get_local_file_path(req.file_url)
    if not local_file_path or len(local_file_path) == 0:
        raise HTTPException(status_code=400, detail="Invalid file URL")

    match req.file_extension:
        case AllowedExtension.HWP:
            loader = HWPLoader(local_file_path)
        case _:
            raise HTTPException(
                status_code=400,
                detail=f"Not Implemented: .{req.file_extension}",
            )

    documents = await loader.aload()

    result = [
        LoadedDocument(page_content=doc.page_content, page_number=number)
        for number, doc in enumerate(documents)
    ]

    return DocumentLoadResponse(documents=result)


async def _get_local_file_path(file_url: str | HttpUrl) -> str:
    try:
        http_url = HttpUrl(file_url)
        return await _download_file(http_url)
    except ValueError as _e:
        return str(file_url)


async def _download_file(file_url: HttpUrl) -> str:
    async with httpx.AsyncClient(follow_redirects=True) as client:
        try:
            import os
            from urllib.parse import unquote

            import aiofiles

            file_name = unquote(os.path.basename(file_url.path or ""))
            file_path = os.path.join("./downloads", file_name)

            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            response = await client.get(str(file_url))
            response.raise_for_status()

            async with aiofiles.open(file_path, "wb") as file:
                for chunk in response.iter_bytes(chunk_size=8192):
                    if chunk:
                        await file.write(chunk)

            return file_path

        except httpx.HTTPStatusError:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to download file: {file_name}",
            )
