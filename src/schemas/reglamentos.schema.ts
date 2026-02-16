import { z } from 'zod';
import type { FolderType } from '../types/reglamentos.types';

// Categories matching DEFAULT_CATEGORIES from reglamentos.types.ts
export const documentCategories = [
  'Reglamentos',
  'Leyes y Decretos',
  'Manuales Técnicos',
  'Procedimientos',
  'Certificaciones',
  'Formatos',
  'Otros',
] as const;

export const documentFolders: FolderType[] = ['asociado', 'administracion', 'compartidos'];

export const documentFormSchema = z.object({
  title: z
    .string()
    .min(3, 'El titulo debe tener al menos 3 caracteres')
    .max(200, 'El titulo no puede tener mas de 200 caracteres'),
  description: z
    .string()
    .min(10, 'La descripcion debe tener al menos 10 caracteres')
    .max(500, 'La descripcion no puede tener mas de 500 caracteres')
    .optional(),
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),
  folderType: z.enum(['asociado', 'administracion', 'compartidos'] as const, {
    message: 'Seleccione una carpeta',
  }),
  fileUrl: z
    .string()
    .min(1, 'El archivo es requerido'),
  fileName: z.string().min(1, 'El nombre del archivo es requerido'),
  fileSize: z.string().optional(),
});

export type DocumentFormData = z.infer<typeof documentFormSchema>;

export const categoryOptions = [
  { value: 'reglamentos', label: 'Reglamentos' },
  { value: 'leyes', label: 'Leyes y Decretos' },
  { value: 'manuales', label: 'Manuales Tecnicos' },
  { value: 'procedimientos', label: 'Procedimientos' },
  { value: 'certificaciones', label: 'Certificaciones' },
  { value: 'formatos', label: 'Formatos' },
  { value: 'otros', label: 'Otros' },
];

export const folderOptions = [
  { value: 'asociado', label: 'Carpeta del Asociado' },
  { value: 'administracion', label: 'Carpeta de Administracion' },
  { value: 'compartidos', label: 'Recursos Compartidos' },
];
