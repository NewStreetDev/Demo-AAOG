import {
  MapPin,
  Hash,
  Tag,
  FileText,
  Edit2,
  Trash2,
  Users,
  Layers,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteLivestockGroup } from '../../hooks/usePecuarioMutations';
import { useGroupHealthActions } from '../../hooks/usePecuario';
import type { LivestockGroup } from '../../types/pecuario.types';
import { speciesOptions, categoryOptionsBySpecies } from '../../schemas/pecuario.schema';

interface LivestockGroupDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestockGroup: LivestockGroup | null;
  onEdit?: (livestockGroup: LivestockGroup) => void;
  onDeleteSuccess?: () => void;
}

const speciesColorMap: Record<string, { bg: string; text: string; border: string }> = {
  bovine: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  porcine: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  caprine: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  buffalo: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  equine: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  ovine: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  poultry: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

export default function LivestockGroupDetailModal({
  open,
  onOpenChange,
  livestockGroup,
  onEdit,
  onDeleteSuccess,
}: LivestockGroupDetailModalProps) {
  const deleteMutation = useDeleteLivestockGroup();
  const { data: groupHealthActions } = useGroupHealthActions();

  if (!livestockGroup) return null;

  const speciesLabel = speciesOptions.find(s => s.value === livestockGroup.species)?.label || livestockGroup.species;
  const categoryLabel = categoryOptionsBySpecies[livestockGroup.species]?.find(
    c => c.value === livestockGroup.category
  )?.label || livestockGroup.category;

  const speciesColors = speciesColorMap[livestockGroup.species] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  };

  // Find health actions associated with this group
  const relatedHealthActions = groupHealthActions?.filter(
    action =>
      action.groupId === livestockGroup.id ||
      action.groupName === livestockGroup.name ||
      (action.species === livestockGroup.species && action.category === livestockGroup.category)
  ) || [];

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar este grupo?')) {
      try {
        await deleteMutation.mutateAsync(livestockGroup.id);
        onOpenChange(false);
        onDeleteSuccess?.();
      } catch (error) {
        console.error('Error deleting livestock group:', error);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle del Grupo"
      description={livestockGroup.name}
      size="md"
    >
      <div className="space-y-6">
        {/* Header with count */}
        <div className={`rounded-lg p-5 text-center ${speciesColors.bg} border ${speciesColors.border}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className={`w-6 h-6 ${speciesColors.text}`} />
          </div>
          <p className={`text-3xl font-bold ${speciesColors.text}`}>{livestockGroup.count}</p>
          <p className={`text-sm ${speciesColors.text} mt-1`}>animales en el grupo</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Species */}
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${speciesColors.bg}`}>
              <Layers className={`w-5 h-5 ${speciesColors.text}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Especie</p>
              <p className="font-medium text-gray-900">{speciesLabel}</p>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Categoria</p>
              <p className="font-medium text-gray-900">{categoryLabel}</p>
            </div>
          </div>

          {/* Count */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Hash className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cantidad</p>
              <p className="font-medium text-gray-900">{livestockGroup.count} cabezas</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ubicacion</p>
              <p className="font-medium text-gray-900">{livestockGroup.location}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {livestockGroup.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Descripcion</h3>
            <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-gray-700">{livestockGroup.description}</p>
            </div>
          </div>
        )}

        {/* Related Health Actions */}
        {relatedHealthActions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Acciones de Salud Asociadas ({relatedHealthActions.length})
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {relatedHealthActions.map((action) => (
                <div
                  key={action.id}
                  className="p-3 rounded-lg border border-gray-100 bg-gray-50/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {action.description}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(action.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {action.affectedCount} animales
                    </span>
                    <span className="capitalize">{action.type}</span>
                    {action.performedBy && (
                      <span>Por: {action.performedBy}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedHealthActions.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No hay acciones de salud asociadas a este grupo
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            className="btn-danger inline-flex items-center gap-2"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </button>
            {onEdit && (
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(livestockGroup);
                }}
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
