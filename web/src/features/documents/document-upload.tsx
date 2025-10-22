import type {
  InputEventHandler,
  MouseEventHandler,
  SubmitEventHandler,
} from 'preact';
import { useCallback, useRef } from 'preact/hooks';
import { fetchLoadDocuments } from '~/features/document-loader';
import { cn } from '~/utils/class-names';
import { convertSize } from './convert-size';
import type { AllowedExtension } from './document.types';
import { fetchGetSasUrl, fetchUploadFile } from './fetcher';
import { documentsStore } from './use-documents';

export function DocumentUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addDocument } = documentsStore.getState();

  const handleSubmit = useCallback<SubmitEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();
  }, []);

  const handleUpload = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (_e) => {
      inputRef.current?.click();
    },
    [inputRef]
  );

  const handleChange = useCallback<InputEventHandler<HTMLInputElement>>(
    async (e) => {
      const file = e.currentTarget.files?.[0] as File;
      if (!file) return;

      // TODO: Validate file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension) return;

      const {
        file_id: fileId,
        upload_url: uploadUrl = '',
        download_url: fileUrl = '',
      } = (await fetchGetSasUrl(fileExtension as AllowedExtension)) ?? {};
      if (!uploadUrl || !fileUrl || !fileId) {
        console.warn('Failed to get SAS URL', { fileId, uploadUrl, fileUrl });
        return;
      }

      const isSuccess = await fetchUploadFile(file, uploadUrl);
      if (!isSuccess) return;

      const { pages = [] } = (await fetchLoadDocuments({
        fileUrl,
        fileExtension: fileExtension as AllowedExtension,
      })) ?? { pages: [] };

      addDocument({
        id: fileId,
        name: file.name,
        size: file.size,
        sizeDisplay: convertSize(file.size),
        type: fileExtension as AllowedExtension,
        url: fileUrl,
        pages: pages.map(({ page_content, page_number }) => ({
          number: page_number,
          content: page_content,
        })),
      });
    },
    [inputRef]
  );

  return (
    <form class="flex flex-col items-center gap-2" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="file"
        class={cn('hidden')}
        multiple
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={handleUpload}
        class={
          'cursor-pointer w-32 px-4 py-2 rounded-md border border-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-150 ease-out'
        }
      >
        Upload
      </button>
    </form>
  );
}
