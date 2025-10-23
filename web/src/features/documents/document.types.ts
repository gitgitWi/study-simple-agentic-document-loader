export type AllowedExtension =
  | 'pdf'
  | 'docx'
  | 'doc'
  | 'txt'
  | 'csv'
  | 'xls'
  | 'xlsx'
  | 'ppt'
  | 'pptx'
  | 'hwp'
  | 'hwpx'
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'gif'
  | 'webp';

export type PageLoaded = {
  number: number;
  content: string;
};

export const DocumentStatus = {
  INITIAL: 'INITIAL',
  LOADING: 'LOADING',
  FINISHED: 'FINISHED',
  ERROR: 'ERROR',
} as const;

export type DocumentLoaded = {
  id: string;
  name: string;
  size: number;
  sizeDisplay: string;
  type: AllowedExtension;
  url: string;
  status: (typeof DocumentStatus)[keyof typeof DocumentStatus];
  pages: PageLoaded[];
};
