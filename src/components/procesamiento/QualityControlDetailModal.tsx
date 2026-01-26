import {
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteQualityControl } from '../../hooks/useProcesamientoMutations';
import type { QualityControl } from '../../types/procesamiento.types';

interface QualityControlDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qualityControl: QualityControl | null;
  onEdit?: (qc: QualityControl) => void;
}

const resultConfig = {
  pass: { label: 'Aprobado', color: 'text-green-600 bg-green-50', icon: CheckCircle2 },
  fail: { label: 'Rechazado', color: 'text-red-600 bg-red-50', icon: XCircle },
  retest: { label: 'Re-evaluar', color: 'text-amber-600 bg-amber-50', icon: AlertTriangle },
};

const gradeConfig: Record<string, { label: string; color: string }> = {
  A: { label: 'Grado A - Excelente', color: 'text-green-600 bg-green-50' },
  B: { label: 'Grado B - Bueno', color: 'text-blue-600 bg-blue-50' },
  C: { label: 'Grado C - Aceptable', color: 'text-amber-600 bg-amber-50' },
  descarte: { label: 'Descarte', color: 'text-red-600 bg-red-50' },
};

const severityConfig: Record<string, { label: string; color: string }> = {
  critical: { label: 'Critico', color: 'text-red-600 bg-red-100' },
  major: { label: 'Mayor', color: 'text-amber-600 bg-amber-100' },
  minor: { label: 'Menor', color: 'text-blue-600 bg-blue-100' },
};

export default function QualityControlDetailModal({
  open,
  onOpenChange,
  qualityControl,
  onEdit,
}: QualityControlDetailModalProps) {
  const deleteMutation = useDeleteQualityControl();

  if (!qualityControl) return null;

  const result = resultConfig[qualityControl.overallResult];
  const ResultIcon = result.icon;
  const grade = gradeConfig[qualityControl.finalGrade];

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar este control de calidad?')) {
      try {
        await deleteMutation.mutateAsync(qualityControl.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting quality control:', error);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de Control de Calidad"
      description={`Lote: ${qualityControl.batchCode}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Header with Result and Grade */}
        <div className="flex items-center flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${result.color}`}>
            <ResultIcon className="w-4 h-4" />
            {result.label}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${grade.color}`}>
            {grade.label}
          </span>
          {qualityControl.approved ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              Aprobado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
              Pendiente de aprobacion
            </span>
          )}
        </div>

        {/* Batch Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-500">Lote Evaluado</h3>
          </div>
          <p className="text-lg font-semibold text-gray-900">{qualityControl.batchCode}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Inspeccion</p>
              <p className="font-medium text-gray-900">{formatDate(qualityControl.inspectionDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inspector</p>
              <p className="font-medium text-gray-900">{qualityControl.inspector}</p>
            </div>
          </div>

          {qualityControl.approvedBy && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aprobado Por</p>
                <p className="font-medium text-gray-900">{qualityControl.approvedBy}</p>
              </div>
            </div>
          )}
        </div>

        {/* Defects */}
        {qualityControl.defectsFound && qualityControl.defectsFound.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Defectos Encontrados</h3>
            <div className="space-y-2">
              {qualityControl.defectsFound.map((defect, index) => {
                const severity = severityConfig[defect.severity];
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${severity.color}`}>
                        {severity.label}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{defect.type}</span>
                    </div>
                    <p className="text-sm text-gray-600">{defect.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes */}
        {qualityControl.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas y Observaciones</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{qualityControl.notes}</p>
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
                  onEdit(qualityControl);
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
