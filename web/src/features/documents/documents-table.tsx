import {
  CircleCheck,
  CircleDashed,
  CircleX,
  FileType2,
  Loader,
  Trash2,
} from 'lucide-preact';
import { createPortal } from 'preact/compat';
import { useCallback, useState } from 'preact/hooks';
import { DISK_SIZES } from './convert-size';
import {
  DOCUMENT_STATUS,
  type DocumentLoaded,
  type DocumentStatus,
} from './document.types';
import { documentsStore } from './documents-store';
import { downloadResult } from './download-result';

export function DocumentsTable() {
  return (
    <div class="flex flex-col gap-2 w-full">
      <h2 class="font-bold text-xl">Files</h2>

      <table class="w-full">
        <thead class="border-neutral-400/90 border-b">
          <tr class="">
            <th class="py-2">Status</th>
            <th class="py-2">Name</th>
            <th class="py-2">Type</th>
            <th class="py-2">Size</th>
            <th class="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documentsStore.documents.value.map((document) => (
            <DocumentTableRow key={document.id} document={document} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentTableRow({ document }: { document: DocumentLoaded }) {
  const [isDocumentVisible, setIsDocumentVisible] = useState(false);

  const showDocument = useCallback(() => {
    const file = new Blob(
      [document.pages.map((page) => page.content).join('')],
      { type: 'text/plain;charset=utf-8' }
    );

    if (file.size > DISK_SIZES.MB * 2) {
      const fileUrl = window.URL.createObjectURL(file);
      downloadResult({ fileUrl, fileName: 'loaded-document.txt' });
      window.URL.revokeObjectURL(fileUrl);
      return;
    }

    setIsDocumentVisible(true);
  }, [document.pages]);

  const hideDocument = useCallback(() => {
    setIsDocumentVisible(false);
  }, []);

  const removeDocument = useCallback(() => {
    documentsStore.removeDocument(document.id);
  }, [document.id]);

  return (
    <>
      <tr class="text-sm">
        <td class="flex justify-center items-center py-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <DocumentStatusIcon status={document.status} />
        </td>
        <td class="py-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {document.name}
        </td>
        <td class="py-2 font-mono text-center">{document.type}</td>
        <td class="py-2 font-mono text-right">{document.sizeDisplay}</td>
        <td class="py-2 text-center">
          <ShowDocumentButton showDocument={showDocument} />
          <RemoveDocumentButton removeDocument={removeDocument} />
        </td>
      </tr>

      {isDocumentVisible && (
        <DocumentViewerModal document={document} hideDocument={hideDocument} />
      )}
    </>
  );
}

function DocumentStatusIcon({ status }: { status: DocumentStatus }) {
  if (status === DOCUMENT_STATUS.LOADING) {
    return <Loader class="animate-spin duration-200 repeat-infinite" />;
  }
  if (status === DOCUMENT_STATUS.FINISHED) {
    return <CircleCheck class="text-green-400" />;
  }
  if (status === DOCUMENT_STATUS.ERROR) {
    return <CircleX class="text-rose-400" />;
  }
  return <CircleDashed class="text-neutral-400" />;
}

function ShowDocumentButton({ showDocument }: { showDocument: () => void }) {
  return (
    <button
      type="button"
      onClick={showDocument}
      class="hover:bg-neutral-700/25 p-1 rounded-md cursor-pointer"
    >
      <FileType2 size={16} />
    </button>
  );
}

function RemoveDocumentButton({
  removeDocument,
}: {
  removeDocument: () => void;
}) {
  return (
    <button
      type="button"
      onClick={removeDocument}
      class="hover:bg-rose-700/25 p-1 rounded-md cursor-pointer"
    >
      <Trash2 size={16} class="text-rose-400" />
    </button>
  );
}

function DocumentViewerModal({
  document,
  hideDocument,
}: {
  document: DocumentLoaded;
  hideDocument: () => void;
}) {
  const stopPropagation = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  return createPortal(
    <div
      class="fixed inset-0 flex justify-center items-center bg-neutral-200/20 backdrop-blur-md p-4 w-full h-full"
      onClick={hideDocument}
    >
      <div
        class="bg-white p-4 rounded-md w-full h-full max-h-[80dvh] overflow-x-hidden overflow-y-auto"
        onClick={stopPropagation}
      >
        <h3 class="font-bold text-lg">{document.name}</h3>

        <section class="flex flex-col gap-2 w-full">
          {document.pages.map((page) => (
            <div
              key={page.number}
              class="bg-neutral-100 p-2 border border-neutral-200 rounded-md"
            >
              <h4 class="font-bold text-md">Page {page.number}</h4>
              <p class="text-neutral-500 text-sm break-all whitespace-pre-wrap">
                {page.content}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>,
    window.document.body
  );
}
