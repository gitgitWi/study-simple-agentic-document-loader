import { FileType2 } from 'lucide-preact';
import { createPortal } from 'preact/compat';
import { useCallback, useState } from 'preact/hooks';
import type { DocumentLoaded } from './document.types';
import { documentsStore } from './documents-store';

export function DocumentsTable() {
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
    setIsDocumentVisible(true);
  }, []);

  const hideDocument = useCallback(() => {
    setIsDocumentVisible(false);
  }, []);

  return (
    <>
      <tr>
        <td>{document.name}</td>
        <td>{document.type}</td>
        <td>{document.sizeDisplay}</td>

        <td>
          <button
            type="button"
            onClick={showDocument}
            class="hover:bg-neutral-700/25 p-2 rounded-md cursor-pointer"
          >
            <FileType2 />
          </button>
        </td>
      </tr>

      {isDocumentVisible && (
        <DocumentViewerModal document={document} hideDocument={hideDocument} />
      )}
    </>
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

        <section>
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
