import { Edit, Trash2, MapPin, Square, Calendar, Tag, Link2 } from 'lucide-react';
import Modal from '../common/Modals/Modal';
import type { Division } from '../../types/finca.types';
import { useDeleteDivision } from '../../hooks/useFincaMutations';

interface DivisionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  division: Division | null;
  onEdit: (division: Division) => void;
  onDeleteSuccess?: () => void;
}

const typeLabels: Record<string, string> = {
  potrero: 'Potrero',
  lote_agricola: 'Lote Agricola',
  apiario: 'Apiario',
  infraestructura: 'Infraestructura',
  reserva: 'Reserva Natural',
  bosque: 'Bosque',
  agua: 'Cuerpo de Agua',
  otro: 'Otro',
};

const statusLabels: Record<string, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  maintenance: 'En Mantenimiento',
  resting: 'En Descanso',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  maintenance: 'bg-amber-100 text-amber-700',
  resting: 'bg-blue-100 text-blue-700',
};

const moduleLabels: Record<string, string> = {
  agro: 'Agricultura',
  pecuario: 'Pecuario',
  apicultura: 'Apicultura',
  procesamiento: 'Procesamiento',
  activos: 'Activos',
  infraestructura: 'Infraestructura',
  general: 'General',
};

export default function DivisionDetailModal({
  open,
  onOpenChange,
  division,
  onEdit,
  onDeleteSuccess,
}: DivisionDetailModalProps) {
  const deleteMutation = useDeleteDivision();

  if (!division) return null;

  const handleDelete = async () => {
    if (!confirm('Esta seguro de eliminar esta division?')) return;

    try {
      await deleteMutation.mutateAsync(division.id);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting division:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={division.name}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header with type and status */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {typeLabels[division.type]}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[division.status]}`}>
            {statusLabels[division.status]}
          </span>
          <span className="text-sm text-gray-500 font-mono">{division.code}</span>
        </div>

        {/* Main info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Square className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Area</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{division.area} ha</p>
          </div>

          {division.coordinates && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Coordenadas</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {division.coordinates.lat.toFixed(4)}, {division.coordinates.lng.toFixed(4)}
              </p>
            </div>
          )}
        </div>

        {/* Module association */}
        {division.moduleAssociation && (
          <div className="flex items-center gap-2 text-gray-600">
            <Link2 className="w-4 h-4" />
            <span className="text-sm">
              Asociado a: <strong>{moduleLabels[division.moduleAssociation]}</strong>
            </span>
          </div>
        )}

        {/* Description */}
        {division.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Descripcion</h4>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {division.description}
            </p>
          </div>
        )}

        {/* Notes */}
        {division.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Notas</h4>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {division.notes}
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Creado: {new Date(division.createdAt).toLocaleDateString('es-CR')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            <span>
              Actualizado: {new Date(division.updatedAt).toLocaleDateString('es-CR')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <button
            onClick={handleDelete}
            className="btn-ghost text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
          <button
            onClick={() => onEdit(division)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>
    </Modal>
  );
}
