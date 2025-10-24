import type { AllowedExtension } from '~/features/documents';

type PageLoaderResult = {
  page_content: string;
  page_number: number;
};

type DocumentLoaderResponse = {
  pages: PageLoaderResult[];
};

type ParserOptions = {
  pdfParser?: 'pymupdf' | 'pdfminer' | 'pypdfium2';
  imageModel?: 'claude-haiku' | 'gpt-4o' | 'gpt-5-mini';
};

type DocumentLoaderRequest = {
  fileUrl: string;
  fileExtension: AllowedExtension;
  parserOptions?: ParserOptions;
};

export const fetchLoadDocuments = async ({
  fileUrl,
  fileExtension,
  parserOptions = undefined,
}: DocumentLoaderRequest) => {
  const apiPath = '/api/v1/documents';
  const response = await fetch(apiPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      file_url: fileUrl,
      file_extension: fileExtension,
      parser_options: parserOptions ?? null,
    }),
  });
  return response.json() as Promise<DocumentLoaderResponse | undefined>;
};
