from enum import StrEnum
from typing import NotRequired, TypedDict

from langchain.chat_models import BaseChatModel, init_chat_model


class ModelNames(StrEnum):
    CLAUDE_SONNET_4_5 = "claude-sonnet-4-5-20250929"
    CLAUDE_HAIKU_4_5 = "claude-haiku-4-5-20251001"
    GPT_4O = "gpt-4o"
    GPT_5_MINI = "gpt-5-mini"


class ModelProviders(StrEnum):
    CLAUDE = "anthropic"
    OPENAI_AZURE = "azure_openai"


class ModelConfigs(TypedDict):
    max_tokens: NotRequired[int]
    temperature: NotRequired[float]
    timeout: NotRequired[int]
    max_retries: NotRequired[int]


DEFAULT_MODEL_CONFIGS = ModelConfigs(
    max_tokens=4096,
    temperature=0.5,
    timeout=10,
    max_retries=2,
)


def get_model(
    model_name: ModelNames, model_config: ModelConfigs | None = None
) -> BaseChatModel | None:
    _config = DEFAULT_MODEL_CONFIGS | (model_config or {})

    match model_name:
        case ModelNames.CLAUDE_SONNET_4_5 | ModelNames.CLAUDE_HAIKU_4_5:
            return init_chat_model(
                model_name, model_provider=ModelProviders.CLAUDE, **_config
            )
        case ModelNames.GPT_5_MINI:
            return init_chat_model(
                model_name, model_provider=ModelProviders.OPENAI_AZURE, **_config
            )
        case ModelNames.GPT_4O:
            return init_chat_model(
                model_name, model_provider=ModelProviders.OPENAI_AZURE, **_config
            )
        case _:
            return None
