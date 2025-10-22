import { effect, signal } from '@preact/signals';
import type { DocumentLoaded } from './document.types';

const createDocumentsSignal = () => {
  const initialDocuments = JSON.parse(
    window.localStorage.getItem('documents-loaded') ??
      '{"version": 1, "documents": []}'
  ) as {
    version: number;
    documents: DocumentLoaded[];
  };

  const documents = signal<DocumentLoaded[]>(initialDocuments.documents);

  const addDocument = (document: DocumentLoaded) => {
    documents.value = documents.value.concat([document]);
  };

  const removeDocument = (id: string) => {
    documents.value = documents.value.filter((document) => document.id !== id);
  };

  effect(() => {
    window.localStorage.setItem(
      'documents-loaded',
      JSON.stringify({
        version: 1,
        documents: documents.value,
      })
    );
  });

  return {
    documents,
    addDocument,
    removeDocument,
  };
};

export const documentsStore = createDocumentsSignal();
