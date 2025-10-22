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

export type DocumentLoaded = {
  id: string;
  name: string;
  size: number;
  sizeDisplay: string;
  type: AllowedExtension;
  url: string;
  pages: PageLoaded[];
};
