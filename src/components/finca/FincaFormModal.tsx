import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '../common/Modals';
import { FormInput, FormField, FormSelect, FormTextArea, FormFileUpload } from '../common/Forms';
import {
  fincaFormSchema,
  fincaStatusOptions,
  type FincaFormData,
} from '../../schemas/finca.schema';
import { useUpdateFinca } from '../../hooks/useFincaMutations';
import type { Finca } from '../../types/finca.types';

const phoneCountryCodeOptions = [
  { code: '+506', label: '+506 (CR)' },
  { code: '+502', label: '+502 (GT)' },
  { code: '+503', label: '+503 (SV)' },
  { code: '+504', label: '+504 (HN)' },
  { code: '+505', label: '+505 (NI)' },
  { code: '+507', label: '+507 (PA)' },
  { code: '+52', label: '+52 (MX)' },
  { code: '+57', label: '+57 (CO)' },
  { code: '+1', label: '+1 (US)' },
];

function parsePhoneNumber(phone: string): { code: string; number: string } {
  if (!phone) return { code: '+506', number: '' };
  for (const opt of phoneCountryCodeOptions) {
    if (phone.startsWith(opt.code + ' ')) {
      return { code: opt.code, number: phone.slice(opt.code.length + 1) };
    }
    if (phone.startsWith(opt.code)) {
      return { code: opt.code, number: phone.slice(opt.code.length) };
    }
  }
  return { code: '+506', number: phone };
}

interface FincaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finca: Finca | null;
  onSuccess?: () => void;
}

export default function FincaFormModal({
  open,
  onOpenChange,
  finca,
  onSuccess,
}: FincaFormModalProps) {
  const updateMutation = useUpdateFinca();
  const isLoading = updateMutation.isPending;
  const [phoneCode, setPhoneCode] = useState('+506');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FincaFormData>({
    resolver: zodResolver(fincaFormSchema),
  });

  useEffect(() => {
    if (open && finca) {
      const parsed = parsePhoneNumber(finca.contactPhone || '');
      setPhoneCode(parsed.code);
      reset({
        name: finca.name,
        totalArea: String(finca.totalArea),
        lat: finca.location.lat ? String(finca.location.lat) : '',
        lng: finca.location.lng ? String(finca.location.lng) : '',
        address: finca.location.address || '',
        department: finca.location.department || '',
        municipality: finca.location.municipality || '',
        owner: finca.ownerName,
        contactPhone: parsed.number,
        contactEmail: finca.contactEmail || '',
        status: finca.status,
        description: finca.description || '',
        imageUrl: finca.imageUrl || '',
        notes: finca.notes || '',
      });
    }
  }, [open, finca, reset]);

  const onSubmit = async (data: FincaFormData) => {
    try {
      const submitData = {
        ...data,
        contactPhone: data.contactPhone ? `${phoneCode} ${data.contactPhone}` : '',
      };
      await updateMutation.mutateAsync(submitData);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving finca:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Finca"
      description="Modifica la informacion general de la finca"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre de la Finca" required error={errors.name?.message}>
            <FormInput
              {...register('name')}
              placeholder="Ej: Finca El Roble"
              error={errors.name?.message}
            />
          </FormField>

          <FormField label="Area Total (hectareas)" required error={errors.totalArea?.message}>
            <FormInput
              type="number"
              step="0.01"
              {...register('totalArea')}
              placeholder="Ej: 85.5"
              error={errors.totalArea?.message}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Propietario" required error={errors.owner?.message}>
            <FormInput
              {...register('owner')}
              placeholder="Nombre del propietario"
              error={errors.owner?.message}
            />
          </FormField>

          <FormField label="Estado" required error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={fincaStatusOptions}
                  placeholder="Seleccionar estado..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Ubicacion</h4>
          <div className="space-y-4">
            <FormField label="Direccion">
              <FormInput
                {...register('address')}
                placeholder="Direccion completa"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Departamento/Provincia">
                <FormInput
                  {...register('department')}
                  placeholder="Ej: Alajuela"
                />
              </FormField>

              <FormField label="Municipio">
                <FormInput
                  {...register('municipality')}
                  placeholder="Ej: San Ramon"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Latitud" error={errors.lat?.message}>
                <FormInput
                  type="number"
                  step="0.0001"
                  {...register('lat')}
                  placeholder="Ej: 10.25"
                  error={errors.lat?.message}
                />
              </FormField>

              <FormField label="Longitud" error={errors.lng?.message}>
                <FormInput
                  type="number"
                  step="0.0001"
                  {...register('lng')}
                  placeholder="Ej: -84.15"
                  error={errors.lng?.message}
                />
              </FormField>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Contacto</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Telefono">
              <div className="flex gap-2">
                <select
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className="flex-shrink-0 w-28 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  {phoneCountryCodeOptions.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FormInput
                  {...register('contactPhone')}
                  placeholder="Ej: 2456-7890"
                  className="flex-1"
                />
              </div>
            </FormField>

            <FormField label="Email" error={errors.contactEmail?.message}>
              <FormInput
                type="email"
                {...register('contactEmail')}
                placeholder="Ej: info@finca.com"
                error={errors.contactEmail?.message}
              />
            </FormField>
          </div>
        </div>

        <FormField label="Descripcion">
          <FormTextArea
            {...register('description')}
            placeholder="Descripcion de la finca..."
            rows={3}
          />
        </FormField>

        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <FormField label="Imagen de la Finca" error={errors.imageUrl?.message}>
              <FormFileUpload
                value={field.value || ''}
                onChange={field.onChange}
                accept="image/*"
                error={errors.imageUrl?.message}
              />
            </FormField>
          )}
        />

        <FormField label="Notas">
          <FormTextArea
            {...register('notes')}
            placeholder="Notas adicionales..."
            rows={2}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
            disabled={isLoading}
            className="btn-primary inline-flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Guardar Cambios
          </button>
        </div>
      </form>
    </Modal>
  );
}
