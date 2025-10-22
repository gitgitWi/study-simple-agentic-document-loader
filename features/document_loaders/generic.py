from typing import Literal, NotRequired, TypedDict

from langchain_community.document_loaders import FileSystemBlobLoader
from langchain_community.document_loaders.generic import GenericLoader
from langchain_community.document_loaders.parsers import (
    LLMImageBlobParser,
    PyMuPDFParser,
)

from features.llms import ModelConfigs, ModelNames, get_model

from .file_extensions import AllowedExtension

image_model = get_model(ModelNames.CLAUDE_HAIKU_4_5, ModelConfigs(max_tokens=4096))


class ParserSettings(TypedDict):
    mode: Literal["single", "page"]
    extract_images: NotRequired[bool]
    extract_tables: NotRequired[Literal["csv", "markdown", "html"]]
    images_inner_format: NotRequired[Literal["text", "markdown-img", "html-img"]]
    images_parser: NotRequired[LLMImageBlobParser | None]


PARSER_SETTINGS: dict[AllowedExtension, ParserSettings] = {
    AllowedExtension.PDF: ParserSettings(
        mode="page",
        extract_images=True,
        extract_tables="markdown",
        images_inner_format="markdown-img",
        images_parser=LLMImageBlobParser(model=image_model) if image_model else None,
    ),
}


def get_generic_loader(file_path: str, file_extension: str) -> GenericLoader | None:
    match file_extension:
        case AllowedExtension.PDF:
            return GenericLoader(
                blob_loader=FileSystemBlobLoader(file_path),
                blob_parser=PyMuPDFParser(
                    **PARSER_SETTINGS[AllowedExtension.PDF],
                ),
            )
        case _:
            return None
