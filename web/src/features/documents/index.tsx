import { DocumentUpload } from './document-upload';
import { DocumentsRoot } from './documents-root';
import { DocumentsTable } from './documents-table';

export type { AllowedExtension } from './document.types';

export const Documents = {
  Root: DocumentsRoot,
  Upload: DocumentUpload,
  Table: DocumentsTable,
} as const;
