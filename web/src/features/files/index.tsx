import {
  createContext,
  type InputEventHandler,
  type MouseEventHandler,
  type SubmitEventHandler,
} from 'preact';
import type { PropsWithChildren } from 'preact/compat';
import { useCallback, useContext, useRef, useState } from 'preact/hooks';
import { cn } from '~/utils/class-names';
import { fetchGetSasUrl, fetchUploadFile } from './fetcher';
import type { AllowedExtension } from './types';

export type AdjustedFile = {
  name: string;
  size: number;
  sizeDisplay: string;
  type: AllowedExtension;
  url: string;
};

const FilesContext = createContext<{
  files: AdjustedFile[];
  setFiles: (files: AdjustedFile[]) => void;
}>({
  files: [],
  setFiles: () => {},
});

const useFilesContext = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error(
      'useFilesContext must be used within a FilesContextProvider'
    );
  }
  return context;
};

function FilesContextProvider({ children }: PropsWithChildren) {
  const [files, setFiles] = useState<AdjustedFile[]>([]);

  return (
    <FilesContext.Provider value={{ files, setFiles }}>
      {children}
    </FilesContext.Provider>
  );
}

function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setFiles } = useFilesContext();

  const handleSubmit = useCallback<SubmitEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
    },
    [setFiles]
  );

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

      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension) return;

      const { upload_url: uploadUrl = '', download_url: downloadUrl = '' } =
        (await fetchGetSasUrl(fileExtension as AllowedExtension)) ?? {};
      if (!uploadUrl || !downloadUrl) return;

      const isSuccess = await fetchUploadFile(file, uploadUrl);
      if (!isSuccess) return;

      // setFiles((prev) => [...prev, { name: file.name, size: file.size, sizeDisplay: file.size.toString(), type: file.type as unknown as AllowedExtension, url: sasUrl }]);
    },
    [inputRef]
  );

  return (
    <form class="flex flex-col gap-2" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="file"
        class={cn('hidden')}
        multiple
        onChange={handleChange}
      />
      <button type="button" onClick={handleUpload} class={'cursor-pointer'}>
        Upload
      </button>
    </form>
  );
}

function FilesTable() {
  const { files } = useFilesContext();

  return (
    <div class="flex flex-col gap-2 w-full">
      <h2 class="font-bold text-2xl">Files</h2>

      <table class="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr>
              <td>{file.name}</td>
              <td>{file.sizeDisplay}</td>
              <td>{file.type}</td>
              <td>
                <button type="button">Show Markdown</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Files = {
  ContextProvider: FilesContextProvider,
  Upload: FileUpload,
  Table: FilesTable,
} as const;
