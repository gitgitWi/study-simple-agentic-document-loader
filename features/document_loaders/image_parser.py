import base64
import io
from typing import TYPE_CHECKING

from langchain_community.document_loaders.parsers.images import BaseImageBlobParser
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage

if TYPE_CHECKING:
    from PIL.Image import Image

_PROMPT_IMAGES_TO_DESCRIPTION: str = (
    "You are an assistant tasked with summarizing images for retrieval. "
    "1. These summaries will be embedded and used to retrieve the raw image. "
    "Give a concise summary of the image that is well optimized for retrieval\n"
    "2. extract all the text from the image. "
    "Do not exclude any content from the page.\n"
    "Format answer in markdown without explanatory text "
    "and without markdown delimiter ``` at the beginning. "
)


# see: langchain_community.document_loaders.parsers.images.LLMImageBlobParser
class LLMImageBlobParser(BaseImageBlobParser):
    """Parser for analyzing images using a language model (LLM).

    Attributes:
        model (BaseChatModel):
          The language model to use for analysis.
        prompt (str):
          The prompt to provide to the language model.
    """

    def __init__(
        self,
        *,
        model: BaseChatModel,
        prompt: str = _PROMPT_IMAGES_TO_DESCRIPTION,
    ):
        """Initializes the LLMImageBlobParser.

        Args:
            model (BaseChatModel):
              The language model to use for analysis.
            prompt (str):
              The prompt to provide to the language model.
        """
        super().__init__()
        self.model = model
        self.prompt = prompt

    def _analyze_image(self, img: "Image") -> str:
        """Analyze an image using the provided language model.

        Args:
            img: The image to be analyzed.

        Returns:
            The extracted textual content.
        """
        image_bytes = io.BytesIO()
        img.save(image_bytes, format="JPEG")
        img_base64 = base64.b64encode(image_bytes.getvalue()).decode("utf-8")

        human_message = HumanMessage(
            content=[
                {
                    "type": "text",
                    "text": self.prompt.format(format=format),
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"},
                },
            ]
        )

        print("[LLMImageBlobParser.human_message]\n", human_message)

        msg = self.model.invoke(
            [
                human_message,
            ]
        )
        result = msg.content
        assert isinstance(result, str)
        return result
