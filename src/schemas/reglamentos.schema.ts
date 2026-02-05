import { z } from 'zod';

export const documentCategories = ['normativo', 'tecnico', 'operativo', 'certificacion'] as const;
export const documentFolders = ['asociado', 'administracion', 'compartidos'] as const;

export const documentFormSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede tener mas de 200 caracteres'),
  description: z
    .string()
    .min(10, 'La descripcion debe tener al menos 10 caracteres')
    .max(500, 'La descripcion no puede tener mas de 500 caracteres'),
  category: z.enum(documentCategories, {
    message: 'Seleccione una categoria',
  }),
  folder: z.enum(documentFolders, {
    message: 'Seleccione una carpeta',
  }),
  fileUrl: z
    .string()
    .min(1, 'La URL del archivo es requerida'),
  fileSize: z.string().optional(),
});

export type DocumentFormData = z.infer<typeof documentFormSchema>;

export const categoryOptions = [
  { value: 'normativo', label: 'Normativo' },
  { value: 'tecnico', label: 'Tecnico' },
  { value: 'operativo', label: 'Operativo' },
  { value: 'certificacion', label: 'Certificacion' },
];

export const folderOptions = [
  { value: 'asociado', label: 'Carpeta del Asociado' },
  { value: 'administracion', label: 'Carpeta de Administracion' },
  { value: 'compartidos', label: 'Recursos Compartidos' },
];
