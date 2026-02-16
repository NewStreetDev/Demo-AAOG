import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '../common/Modals';
import { FormInput, FormField, FormSelect, FormTextArea, FormFileUpload } from '../common/Forms';
import {
  documentFormSchema,
  categoryOptions,
  folderOptions,
  type DocumentFormData,
} from '../../schemas/reglamentos.schema';
import { useCreateDocument } from '../../hooks/useReglamentos';
import type { FolderType } from '../../types/reglamentos.types';

interface DocumentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultFolder?: FolderType;
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
    setValue,
    formState: { errors },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      categoryName: '',
      folderType: defaultFolder,
      fileUrl: '',
      fileName: '',
      fileSize: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: '',
        description: '',
        categoryId: '',
        categoryName: '',
        folderType: defaultFolder,
        fileUrl: '',
        fileName: '',
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
          name="title"
          control={control}
          render={({ field }) => (
            <FormField label="Titulo del documento" required error={errors.title?.message}>
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
          name="categoryId"
          control={control}
          render={({ field }) => (
            <FormField label="Categoria" error={errors.categoryId?.message}>
              <FormSelect
                options={categoryOptions}
                value={field.value || ''}
                onValueChange={field.onChange}
                placeholder="Seleccione una categoria"
              />
            </FormField>
          )}
        />

        <Controller
          name="folderType"
          control={control}
          render={({ field }) => (
            <FormField label="Carpeta destino" required error={errors.folderType?.message}>
              <FormSelect
                options={folderOptions}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Seleccione una carpeta"
              />
            </FormField>
          )}
        />

        <div className="space-y-2">
          <Controller
            name="fileUrl"
            control={control}
            render={({ field }) => (
              <FormField label="Adjuntar archivo" required error={errors.fileUrl?.message || errors.fileName?.message}>
                <FormFileUpload
                  value={field.value || ''}
                  onChange={(val: string) => {
                    field.onChange(val);
                    // Extract filename from data URL or set a generic name
                    if (val) {
                      const match = val.match(/^data:.*?;/);
                      const ext = match ? match[0].replace('data:', '').replace(';', '').split('/')[1] || 'pdf' : 'pdf';
                      const timestamp = Date.now();
                      const autoName = `documento-${timestamp}.${ext}`;
                      setValue('fileName', autoName);
                    } else {
                      setValue('fileName', '');
                    }
                  }}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.gif"
                  error={errors.fileUrl?.message}
                />
              </FormField>
            )}
          />
        </div>

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
