from enum import StrEnum
from typing import Literal, NotRequired, TypedDict, Union

from langchain_community.document_loaders import FileSystemBlobLoader
from langchain_community.document_loaders.generic import GenericLoader
from langchain_community.document_loaders.parsers import (
    PDFMinerParser,
    PyMuPDFParser,
    PyPDFium2Parser,
)

from features.llms import ModelConfigs, ModelNames, get_model

from .file_extensions import AllowedExtension
from .image_parser import LLMImageBlobParser


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
        images_inner_format="markdown-img",
    ),
}


class PdfParsers(StrEnum):
    PYMUPDF = "pymupdf"
    PDFMINER = "pdfminer"
    PYPDFIUM2 = "pypdfium2"


class ImageModels(StrEnum):
    CLAUDE_HAIKU = "claude-haiku"
    GPT_4O = "gpt-4o"
    GPT_5_MINI = "gpt-5-mini"


class ParserOptions(TypedDict):
    pdf_parser: NotRequired[Union[PdfParsers, None]]
    image_model: NotRequired[Union[ImageModels, None]]


DEFAULT_PARSER_OPTIONS = ParserOptions(
    pdf_parser=PdfParsers.PYPDFIUM2,
    image_model=ImageModels.GPT_5_MINI,
)


def get_pdf_parser(pdf_parser: PdfParsers | None):
    print("pdf_parser: ", pdf_parser)
    match pdf_parser:
        case PdfParsers.PDFMINER:
            return PDFMinerParser
        case PdfParsers.PYPDFIUM2:
            return PyPDFium2Parser
        case _:
            return PyMuPDFParser


def get_image_model_name(image_model: ImageModels | None):
    print("image_model: ", image_model)
    match image_model:
        case ImageModels.GPT_4O:
            return ModelNames.GPT_4O
        case ImageModels.GPT_5_MINI:
            return ModelNames.GPT_5_MINI
        case _:
            return ModelNames.CLAUDE_HAIKU_4_5


def get_generic_loader(
    file_path: str, file_extension: str, parser_options: ParserOptions
) -> GenericLoader | None:
    match file_extension:
        case AllowedExtension.PDF:
            image_model = get_model(
                get_image_model_name(parser_options.get("image_model")),
                ModelConfigs(max_tokens=4096),
            )
            pdf_parser = get_pdf_parser(parser_options.get("pdf_parser"))

            pdf_parser_settings = PARSER_SETTINGS[AllowedExtension.PDF]
            if parser_options.get("pdf_parser") == PdfParsers.PYMUPDF:
                pdf_parser_settings["extract_tables"] = "markdown"

            return GenericLoader(
                blob_loader=FileSystemBlobLoader(file_path),
                blob_parser=pdf_parser(
                    images_parser=LLMImageBlobParser(model=image_model)
                    if image_model
                    else None,
                    **(pdf_parser_settings),
                ),
            )
        case _:
            return None
