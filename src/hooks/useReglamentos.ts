import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Document } from '../types/reglamentos.types';
import type { DocumentFormData } from '../schemas/reglamentos.schema';

// Helper to parse fileSize string to bytes
const parseFileSize = (size: string): number => {
  const match = size.match(/^([\d.]+)\s*(KB|MB|GB)?$/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = (match[2] || 'B').toUpperCase();
  const multipliers: Record<string, number> = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
  return Math.round(value * (multipliers[unit] || 1));
};

let mockDocuments: Document[] = [
  // Carpeta del Asociado
  {
    id: '1',
    title: 'Reglamento de Agricultura Organica',
    description: 'Normativa nacional para la produccion agricola organica certificada',
    fileName: 'reglamento-agricultura-organica.pdf',
    fileUrl: '/documents/reglamento-agricultura-organica.pdf',
    fileSize: parseFileSize('2.4 MB'),
    mimeType: 'application/pdf',
    folderType: 'asociado',
    folderId: 'folder-asociado-1',
    categoryId: 'reglamentos',
    categoryName: 'Reglamentos',
    uploadedAt: new Date('2024-01-15'),
    uploadedBy: 'user-1',
    uploadedByName: 'Juan Perez',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Mi Certificacion Organica 2024',
    description: 'Copia del certificado organico vigente para la finca del asociado',
    fileName: 'certificacion-organica-2024.pdf',
    fileUrl: '/documents/certificacion-organica-2024.pdf',
    fileSize: parseFileSize('1.1 MB'),
    mimeType: 'application/pdf',
    folderType: 'asociado',
    folderId: 'folder-asociado-1',
    categoryId: 'certificaciones',
    categoryName: 'Certificaciones',
    uploadedAt: new Date('2024-04-05'),
    uploadedBy: 'user-1',
    uploadedByName: 'Juan Perez',
    isActive: true,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05'),
  },
  // Carpeta de Administracion
  {
    id: '3',
    title: 'Protocolo de Trazabilidad',
    description: 'Procedimientos para el registro y seguimiento de productos',
    fileName: 'protocolo-trazabilidad.pdf',
    fileUrl: '/documents/protocolo-trazabilidad.pdf',
    fileSize: parseFileSize('1.8 MB'),
    mimeType: 'application/pdf',
    folderType: 'administracion',
    folderId: 'folder-admin-1',
    categoryId: 'procedimientos',
    categoryName: 'Procedimientos',
    uploadedAt: new Date('2024-03-10'),
    uploadedBy: 'admin-1',
    uploadedByName: 'Admin Sistema',
    isActive: true,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    title: 'Informe de Auditoria Interna 2024',
    description: 'Resultados de la auditoria interna de cumplimiento normativo anual',
    fileName: 'auditoria-interna-2024.pdf',
    fileUrl: '/documents/auditoria-interna-2024.pdf',
    fileSize: parseFileSize('3.7 MB'),
    mimeType: 'application/pdf',
    folderType: 'administracion',
    folderId: 'folder-admin-1',
    categoryId: 'procedimientos',
    categoryName: 'Procedimientos',
    uploadedAt: new Date('2024-06-20'),
    uploadedBy: 'admin-1',
    uploadedByName: 'Admin Sistema',
    isActive: true,
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: '5',
    title: 'Registro de Sanciones y Hallazgos',
    description: 'Documentacion de no conformidades y acciones correctivas de asociados',
    fileName: 'sanciones-hallazgos.pdf',
    fileUrl: '/documents/sanciones-hallazgos.pdf',
    fileSize: parseFileSize('2.1 MB'),
    mimeType: 'application/pdf',
    folderType: 'administracion',
    folderId: 'folder-admin-1',
    categoryId: 'reglamentos',
    categoryName: 'Reglamentos',
    uploadedAt: new Date('2024-05-15'),
    uploadedBy: 'admin-1',
    uploadedByName: 'Admin Sistema',
    isActive: true,
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-05-15'),
  },
  // Recursos Compartidos
  {
    id: '6',
    title: 'Manual de Buenas Practicas Pecuarias',
    description: 'Guia tecnica para el manejo sanitario y bienestar animal',
    fileName: 'manual-bpp.pdf',
    fileUrl: '/documents/manual-bpp.pdf',
    fileSize: parseFileSize('5.1 MB'),
    mimeType: 'application/pdf',
    folderType: 'compartidos',
    folderId: 'folder-compartidos-1',
    categoryId: 'manuales',
    categoryName: 'Manuales Tecnicos',
    uploadedAt: new Date('2024-02-20'),
    uploadedBy: 'admin-1',
    uploadedByName: 'Admin Sistema',
    isActive: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '7',
    title: 'Requisitos Certificacion Organica',
    description: 'Documentacion requerida para obtener y mantener la certificacion organica',
    fileName: 'requisitos-certificacion.pdf',
    fileUrl: '/documents/requisitos-certificacion.pdf',
    fileSize: parseFileSize('3.2 MB'),
    mimeType: 'application/pdf',
    folderType: 'compartidos',
    folderId: 'folder-compartidos-1',
    categoryId: 'certificaciones',
    categoryName: 'Certificaciones',
    uploadedAt: new Date('2024-04-05'),
    uploadedBy: 'admin-1',
    uploadedByName: 'Admin Sistema',
    isActive: true,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05'),
  },
  {
    id: '8',
    title: 'Normas de Procesamiento de Alimentos',
    description: 'Regulaciones para el procesamiento y transformacion de productos agricolas',
    fileName: 'normas-procesamiento.pdf',
    fileUrl: '/documents/normas-procesamiento.pdf',
    fileSize: parseFileSize('4.5 MB'),
    mimeType: 'application/pdf',
    folderType: 'compartidos',
    folderId: 'folder-compartidos-1',
    categoryId: 'reglamentos',
    categoryName: 'Reglamentos',
    uploadedAt: new Date('2024-05-12'),
    uploadedBy: 'admin-1',
    uploadedByName: 'Admin Sistema',
    isActive: true,
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-05-12'),
  },
  {
    id: '9',
    title: 'Guia de Manejo Integrado de Plagas',
    description: 'Estrategias y metodos permitidos para el control de plagas en agricultura organica',
    fileName: 'guia-mip.pdf',
    fileUrl: '/documents/guia-mip.pdf',
    fileSize: parseFileSize('2.9 MB'),
    mimeType: 'application/pdf',
    folderType: 'compartidos',
    folderId: 'folder-compartidos-1',
    categoryId: 'manuales',
    categoryName: 'Manuales Tecnicos',
    uploadedAt: new Date('2024-06-08'),
    uploadedBy: 'admin-1',
    uploadedByName: 'Admin Sistema',
    isActive: true,
    createdAt: new Date('2024-06-08'),
    updatedAt: new Date('2024-06-08'),
  },
];

export function useDocuments() {
  return useQuery<Document[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...mockDocuments];
    },
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DocumentFormData): Promise<Document> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const now = new Date();
      const newDocument: Document = {
        id: String(Date.now()),
        title: data.title,
        description: data.description,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize ? parseFileSize(data.fileSize) : 0,
        mimeType: 'application/pdf',
        folderType: data.folderType,
        folderId: `folder-${data.folderType}-1`,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        uploadedAt: now,
        uploadedBy: 'user-1', // Would come from auth context in real app
        uploadedByName: 'Usuario Actual',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      mockDocuments = [newDocument, ...mockDocuments];
      return newDocument;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      mockDocuments = mockDocuments.filter(d => d.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
