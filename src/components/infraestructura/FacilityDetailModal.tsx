import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Building2,
  Wrench,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteFacility } from '../../hooks/useInfraestructuraMutations';
import type { Facility } from '../../types/infraestructura.types';

interface FacilityDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility: Facility | null;
  onEdit?: (facility: Facility) => void;
  onDeleteSuccess?: () => void;
}

function getStatusBadgeColor(status: Facility['status']): string {
  const colors = {
    operational: 'bg-green-100 text-green-700',
    maintenance: 'bg-amber-100 text-amber-700',
    out_of_service: 'bg-red-100 text-red-700',
    under_construction: 'bg-blue-100 text-blue-700',
  };
  return colors[status] || colors.operational;
}

function getStatusLabel(status: Facility['status']): string {
  const labels = {
    operational: 'Operativa',
    maintenance: 'En Mantenimiento',
    out_of_service: 'Fuera de Servicio',
    under_construction: 'En Construcción',
  };
  return labels[status];
}

function getTypeLabel(type: Facility['type']): string {
  const labels: Record<Facility['type'], string> = {
    building: 'Edificio',
    storage: 'Almacén',
    processing: 'Procesamiento',
    housing: 'Vivienda',
    greenhouse: 'Invernadero',
    barn: 'Establo',
    water_reservoir: 'Reservorio de Agua',
    tank: 'Tanque',
    irrigation_system: 'Sistema de Riego',
    well: 'Pozo',
    water_intake: 'Captación de Agua',
    other: 'Otro',
  };
  return labels[type];
}

function getModuleLabel(module: string | undefined): string {
  if (!module) return '-';
  const labels: Record<string, string> = {
    agro: 'Agricultura',
    pecuario: 'Pecuario',
    apicultura: 'Apicultura',
    procesamiento: 'Procesamiento',
    general: 'General',
  };
  return labels[module] || module;
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return '-';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function FacilityDetailModal({
  open,
  onOpenChange,
  facility,
  onEdit,
  onDeleteSuccess,
}: FacilityDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteFacility();

  if (!facility) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(facility.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(facility);
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={facility.name}
        description={getTypeLabel(facility.type)}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badge */}
          <div className="flex justify-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                facility.status
              )}`}
            >
              {getStatusLabel(facility.status)}
            </span>
          </div>

          {/* Summary Cards */}
          {(facility.area || facility.capacity) && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {facility.area && (
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600 uppercase tracking-wide">Área</p>
                  <p className="text-lg font-bold text-blue-700 mt-1">
                    {facility.area.toLocaleString()} m²
                  </p>
                </div>
              )}
              {facility.capacity && (
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-purple-600 uppercase tracking-wide">Capacidad</p>
                  <p className="text-lg font-bold text-purple-700 mt-1">
                    {facility.capacity}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<MapPin className="w-4 h-4" />}
              label="Ubicación"
              value={facility.location}
            />
            <DetailRow
              icon={<Building2 className="w-4 h-4" />}
              label="Módulo Asignado"
              value={getModuleLabel(facility.assignedModule)}
            />
            {facility.constructionDate && (
              <DetailRow
                icon={<Calendar className="w-4 h-4" />}
                label="Fecha de Construcción"
                value={formatDate(facility.constructionDate)}
              />
            )}
            {facility.lastMaintenanceDate && (
              <DetailRow
                icon={<Wrench className="w-4 h-4" />}
                label="Último Mantenimiento"
                value={formatDate(facility.lastMaintenanceDate)}
              />
            )}
            {facility.nextMaintenanceDate && (
              <DetailRow
                icon={<Calendar className="w-4 h-4" />}
                label="Próximo Mantenimiento"
                value={formatDate(facility.nextMaintenanceDate)}
              />
            )}
            {facility.description && (
              <DetailRow
                icon={<FileText className="w-4 h-4" />}
                label="Descripción"
                value={facility.description}
              />
            )}
          </div>

          {/* Notes */}
          {facility.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">Notas</p>
              <p className="text-sm text-amber-800">{facility.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between gap-3 pt-5 mt-5 border-t border-gray-100">
            <button
              type="button"
              className="btn-ghost text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
            <button
              type="button"
              className="btn-primary inline-flex items-center gap-2"
              onClick={handleEdit}
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Eliminar Instalación"
        description={`¿Estás seguro de que deseas eliminar "${facility.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
