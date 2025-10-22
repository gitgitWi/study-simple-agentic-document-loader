from environs import env
from pydantic import BaseModel, Field, SecretStr

env.read_env()


class Envs(BaseModel):
    # azure blob storage
    azure_blob_account_name: str = Field(..., min_length=2)
    azure_blob_account_url: str = Field(..., min_length=2)
    azure_blob_account_key: SecretStr = Field(..., min_length=2)
    azure_blob_container_name: str = Field(..., min_length=2)
    azure_blob_connection_string: str = Field(..., min_length=2)

    # llm providers
    anthropic_api_key: SecretStr = Field(..., min_length=2)

    azure_openai_gpt5_version: str = Field(..., min_length=2)
    azure_openai_gpt5_api_key: SecretStr = Field(..., min_length=2)
    azure_openai_gpt5_endpoint: str = Field(..., min_length=2)
    azure_openai_gpt5_deployment_name: str = Field(..., min_length=2)

    azure_openai_gpt4_version: str = Field(..., min_length=2)
    azure_openai_gpt4_api_key: SecretStr = Field(..., min_length=2)
    azure_openai_gpt4_endpoint: str = Field(..., min_length=2)
    azure_openai_gpt4_deployment_name: str = Field(..., min_length=2)


envs = Envs(
    azure_blob_account_name=env.str("AZURE_BLOB_ACCOUNT_NAME"),
    azure_blob_account_url=env.str("AZURE_BLOB_ACCOUNT_URL"),
    azure_blob_account_key=env.str("AZURE_BLOB_ACCOUNT_KEY"),
    azure_blob_container_name=env.str("AZURE_BLOB_CONTAINER_NAME"),
    azure_blob_connection_string=env.str("AZURE_BLOB_CONNECTION_STRING"),
    anthropic_api_key=env.str("ANTHROPIC_API_KEY"),
    azure_openai_gpt5_version=env.str("AZURE_OPENAI_GPT5_VERSION"),
    azure_openai_gpt5_api_key=env.str("AZURE_OPENAI_GPT5_API_KEY"),
    azure_openai_gpt5_endpoint=env.str("AZURE_OPENAI_GPT5_ENDPOINT"),
    azure_openai_gpt5_deployment_name=env.str("AZURE_OPENAI_GPT5_DEPLOYMENT_NAME"),
    azure_openai_gpt4_version=env.str("AZURE_OPENAI_GPT4_VERSION"),
    azure_openai_gpt4_api_key=env.str("AZURE_OPENAI_GPT4_API_KEY"),
    azure_openai_gpt4_endpoint=env.str("AZURE_OPENAI_GPT4_ENDPOINT"),
    azure_openai_gpt4_deployment_name=env.str("AZURE_OPENAI_GPT4_DEPLOYMENT_NAME"),
)
