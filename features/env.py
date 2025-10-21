from environs import env
from pydantic import BaseModel, Field, SecretStr

env.read_env()


class Envs(BaseModel):
    azure_blob_account_name: str = Field(..., min_length=2)
    azure_blob_account_url: str = Field(..., min_length=2)
    azure_blob_account_key: SecretStr = Field(..., min_length=2)
    azure_blob_container_name: str = Field(..., min_length=2)
    azure_blob_connection_string: str = Field(..., min_length=2)


envs = Envs(
    azure_blob_account_name=env.str("AZURE_BLOB_ACCOUNT_NAME"),
    azure_blob_account_url=env.str("AZURE_BLOB_ACCOUNT_URL"),
    azure_blob_account_key=env.str("AZURE_BLOB_ACCOUNT_KEY"),
    azure_blob_container_name=env.str("AZURE_BLOB_CONTAINER_NAME"),
    azure_blob_connection_string=env.str("AZURE_BLOB_CONNECTION_STRING"),
)
