from langchain_core.document_loaders import BaseLoader

from .file_extensions import AllowedExtension
from .hwp import HWPLoader


# TODO: file_path 받지 말고 loader 클래스만 반환
def get_loader(extension: str, file_path: str) -> BaseLoader | None:
    match extension:
        case AllowedExtension.HWP:
            return HWPLoader(file_path)
        case AllowedExtension.HWPX:
            return None
        case AllowedExtension.PDF:
            return None
        case AllowedExtension.DOC:
            return None
        case AllowedExtension.DOCX:
            return None
        case AllowedExtension.TXT:
            return None
        case AllowedExtension.CSV:
            return None
        case AllowedExtension.XLS:
            return None
        case AllowedExtension.XLSX:
            return None
        case AllowedExtension.PPT:
            return None
        case AllowedExtension.PPTX:
            return None
        case _:
            return None
