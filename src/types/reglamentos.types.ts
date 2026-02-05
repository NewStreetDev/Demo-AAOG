export type DocumentFolder = 'asociado' | 'administracion' | 'compartidos';

export interface Document {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  uploadedAt: string;
  category: 'normativo' | 'tecnico' | 'operativo' | 'certificacion';
  folder: DocumentFolder;
  fileSize?: string;
}
