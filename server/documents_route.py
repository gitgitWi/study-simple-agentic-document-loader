from typing import List

from fastapi import APIRouter
from pydantic import BaseModel, Field

from features.document_loaders import HWPLoader

router = APIRouter()


class DocumentLoadRequest(BaseModel):
    file_url: str = Field(..., description="File path")


class LoadedDocument(BaseModel):
    page_content: str
    page_number: int


class DocumentLoadResponse(BaseModel):
    documents: List[LoadedDocument]


@router.post("/documents", response_model=DocumentLoadResponse)
async def documents_route(req: DocumentLoadRequest):
    loader = HWPLoader(req.file_url)
    documents = await loader.aload()

    result = [
        LoadedDocument(page_content=doc.page_content, page_number=number)
        for number, doc in enumerate(documents)
    ]

    print("result: ", result)

    return DocumentLoadResponse(documents=result)
