from enum import StrEnum


class AllowedExtension(StrEnum):
    PDF = "pdf"
    DOC = "doc"
    DOCX = "docx"
    TXT = "txt"
    CSV = "csv"
    XLS = "xls"
    XLSX = "xlsx"
    PPT = "ppt"
    PPTX = "pptx"
    HWP = "hwp"
    HWPX = "hwpx"
    JPG = "jpg"
    JPEG = "jpeg"
    PNG = "png"
    GIF = "gif"
    WEBP = "webp"


def is_valid_extension(extension: str) -> bool:
    try:
        AllowedExtension(extension.lower())
        return True
    except ValueError:
        return False
