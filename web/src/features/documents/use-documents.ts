import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import type { DocumentLoaded } from './document.types';

type DocumentsState = {
  documents: DocumentLoaded[];
  addDocument: (document: DocumentLoaded) => void;
  removeDocument: (id: string) => void;
};

export const documentsStore = createStore<DocumentsState>()(
  persist(
    (set) => ({
      documents: [] as DocumentLoaded[],

      addDocument: (document) =>
        set((state) => ({ documents: state.documents.concat([document]) })),

      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((document) => document.id !== id),
        })),
    }),
    {
      name: 'documents-loaded',
      storage: createJSONStorage(() => window.localStorage),
    }
  )
);
