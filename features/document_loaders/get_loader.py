from langchain_core.document_loaders import BaseLoader

from .file_extensions import AllowedExtension
from .generic import get_generic_loader
from .hwp import HWPLoader


# TODO: file_path 받지 말고 loader 클래스만 반환
def get_loader(extension: str, file_path: str) -> BaseLoader | None:
    match extension:
        case AllowedExtension.HWP:
            return HWPLoader(file_path)
        case AllowedExtension.HWPX:
            return None
        case _:
            return get_generic_loader(file_path, extension)
