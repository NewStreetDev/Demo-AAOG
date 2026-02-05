import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Document } from '../types/reglamentos.types';
import type { DocumentFormData } from '../schemas/reglamentos.schema';

let mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Reglamento de Agricultura Organica',
    description: 'Normativa nacional para la produccion agricola organica certificada',
    fileUrl: '/documents/reglamento-agricultura-organica.pdf',
    uploadedAt: '2024-01-15',
    category: 'normativo',
    fileSize: '2.4 MB',
  },
  {
    id: '2',
    name: 'Manual de Buenas Practicas Pecuarias',
    description: 'Guia tecnica para el manejo sanitario y bienestar animal',
    fileUrl: '/documents/manual-bpp.pdf',
    uploadedAt: '2024-02-20',
    category: 'tecnico',
    fileSize: '5.1 MB',
  },
  {
    id: '3',
    name: 'Protocolo de Trazabilidad',
    description: 'Procedimientos para el registro y seguimiento de productos',
    fileUrl: '/documents/protocolo-trazabilidad.pdf',
    uploadedAt: '2024-03-10',
    category: 'operativo',
    fileSize: '1.8 MB',
  },
  {
    id: '4',
    name: 'Requisitos Certificacion Organica',
    description: 'Documentacion requerida para obtener y mantener la certificacion organica',
    fileUrl: '/documents/requisitos-certificacion.pdf',
    uploadedAt: '2024-04-05',
    category: 'certificacion',
    fileSize: '3.2 MB',
  },
  {
    id: '5',
    name: 'Normas de Procesamiento de Alimentos',
    description: 'Regulaciones para el procesamiento y transformacion de productos agricolas',
    fileUrl: '/documents/normas-procesamiento.pdf',
    uploadedAt: '2024-05-12',
    category: 'normativo',
    fileSize: '4.5 MB',
  },
  {
    id: '6',
    name: 'Guia de Manejo Integrado de Plagas',
    description: 'Estrategias y metodos permitidos para el control de plagas en agricultura organica',
    fileUrl: '/documents/guia-mip.pdf',
    uploadedAt: '2024-06-08',
    category: 'tecnico',
    fileSize: '2.9 MB',
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

      const newDocument: Document = {
        id: String(Date.now()),
        name: data.name,
        description: data.description,
        fileUrl: data.fileUrl,
        uploadedAt: new Date().toISOString().split('T')[0],
        category: data.category,
        fileSize: data.fileSize,
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
