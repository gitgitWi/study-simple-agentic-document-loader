import datetime

from azure.storage.blob import BlobSasPermissions, BlobServiceClient, generate_blob_sas
from fastapi import APIRouter
from pydantic import BaseModel, Field
from ulid import ULID

from features.env import envs

blob_service_client = BlobServiceClient.from_connection_string(
    conn_str=envs.azure_blob_connection_string
)


blob_container_client = blob_service_client.get_container_client(
    envs.azure_blob_container_name
)


class GetSASUrlRequest(BaseModel):
    file_extension: str = Field(..., description="File extension")


class GetSASUrlResponse(BaseModel):
    upload_url: str = Field(..., description="Upload SAS URL")
    download_url: str = Field(..., description="Download URL")


files_router = APIRouter(prefix="/files")


@files_router.post("/sas-url")
async def get_sas_url(request: GetSASUrlRequest):
    start_time = datetime.datetime.now(datetime.timezone.utc)
    expiry_time = start_time + datetime.timedelta(minutes=5)
    file_name = f".samples/{ULID()}.{request.file_extension}"

    sas_token = generate_blob_sas(
        account_name=envs.azure_blob_account_name,
        container_name=envs.azure_blob_container_name,
        blob_name=file_name,
        account_key=envs.azure_blob_account_key.get_secret_value(),
        start=start_time,
        expiry=expiry_time,
        permission=BlobSasPermissions(create=True, write=True),
    )

    file_url = (
        f"{envs.azure_blob_account_url}/{envs.azure_blob_container_name}/{file_name}"
    )
    upload_url = f"{file_url}?{sas_token}"

    return GetSASUrlResponse(
        upload_url=upload_url,
        download_url=file_url,
    )
