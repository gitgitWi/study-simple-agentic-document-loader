import type { AllowedExtension } from '~/features/files';

export type DocumentLoaded = {
  page_content: string;
  page_number: number;
};

type DocumentLoadResponse = {
  documents: DocumentLoaded[];
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
