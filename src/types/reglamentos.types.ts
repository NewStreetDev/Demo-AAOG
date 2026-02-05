export interface Document {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  uploadedAt: string;
  category: 'normativo' | 'tecnico' | 'operativo' | 'certificacion';
  fileSize?: string;
}
