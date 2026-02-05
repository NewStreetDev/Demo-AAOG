import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '../common/Modals';
import { FormInput, FormField, FormSelect, FormTextArea } from '../common/Forms';
import {
  documentFormSchema,
  categoryOptions,
  folderOptions,
  type DocumentFormData,
} from '../../schemas/reglamentos.schema';
import { useCreateDocument } from '../../hooks/useReglamentos';
import type { DocumentFolder } from '../../types/reglamentos.types';

interface DocumentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultFolder?: DocumentFolder;
}

export default function DocumentFormModal({
  open,
  onOpenChange,
  onSuccess,
  defaultFolder = 'compartidos',
}: DocumentFormModalProps) {
  const createMutation = useCreateDocument();
  const isLoading = createMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'normativo',
      folder: defaultFolder,
      fileUrl: '',
      fileSize: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        description: '',
        category: 'normativo',
        folder: defaultFolder,
        fileUrl: '',
        fileSize: '',
      });
    }
  }, [open, reset, defaultFolder]);

  const onSubmit = async (data: DocumentFormData) => {
    try {
      await createMutation.mutateAsync(data);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Agregar Documento"
      description="Registrar un nuevo documento normativo"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <FormField label="Nombre del documento" error={errors.name?.message}>
              <FormInput
                placeholder="Ej: Reglamento de Agricultura Organica"
                {...field}
              />
            </FormField>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormField label="Descripcion" error={errors.description?.message}>
              <FormTextArea
                placeholder="Describe brevemente el contenido del documento"
                rows={3}
                {...field}
              />
            </FormField>
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <FormField label="Categoria" error={errors.category?.message}>
              <FormSelect
                options={categoryOptions}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Seleccione una categoria"
              />
            </FormField>
          )}
        />

        <Controller
          name="folder"
          control={control}
          render={({ field }) => (
            <FormField label="Carpeta destino" error={errors.folder?.message}>
              <FormSelect
                options={folderOptions}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Seleccione una carpeta"
              />
            </FormField>
          )}
        />

        <Controller
          name="fileUrl"
          control={control}
          render={({ field }) => (
            <FormField label="URL del archivo" error={errors.fileUrl?.message}>
              <FormInput
                placeholder="/documents/nombre-archivo.pdf"
                {...field}
              />
            </FormField>
          )}
        />

        <Controller
          name="fileSize"
          control={control}
          render={({ field }) => (
            <FormField label="Tamano del archivo (opcional)" error={errors.fileSize?.message}>
              <FormInput
                placeholder="Ej: 2.4 MB"
                {...field}
              />
            </FormField>
          )}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary inline-flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Agregar Documento
          </button>
        </div>
      </form>
    </Modal>
  );
}
