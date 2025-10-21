import type { AllowedExtension } from './types';

type GetSASUrlResponse = {
  upload_url: string;
  download_url: string;
};

export const fetchGetSasUrl = async (fileExtension: AllowedExtension) => {
  const apiPath = '/api/files/sas-url';
  const response = await fetch(apiPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ file_extension: fileExtension }),
  });
  return response.json() as Promise<GetSASUrlResponse | undefined>;
};

export const fetchUploadFile = async (file: File, sasUrl: string) => {
  const response = await fetch(sasUrl, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
    },
    body: file,
  });

  return response.ok;
};
