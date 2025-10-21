import type { AllowedExtension } from '~/features/files';

type DocumentLoadResponse = {
  documents: {
    page_content: string;
    page_number: number;
  }[];
};

export const fetchLoadDocuments = async ({
  fileUrl,
  fileExtension,
}: {
  fileUrl: string;
  fileExtension: AllowedExtension;
}) => {
  const apiPath = '/api/v1/documents';
  const response = await fetch(apiPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ file_url: fileUrl, file_extension: fileExtension }),
  });
  return response.json() as Promise<DocumentLoadResponse | undefined>;
};
