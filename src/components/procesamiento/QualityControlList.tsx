import {
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import type { QualityControl } from '../../types/procesamiento.types';

interface QualityControlListProps {
  qualityControls: QualityControl[];
  onQCClick?: (qc: QualityControl) => void;
}

const resultConfig = {
  pass: {
    label: 'Aprobado',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle2,
  },
  fail: {
    label: 'Rechazado',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: XCircle,
  },
  retest: {
    label: 'Re-evaluar',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: AlertTriangle,
  },
};

const gradeConfig: Record<string, { label: string; color: string }> = {
  A: { label: 'A', color: 'bg-green-100 text-green-700 border-green-200' },
  B: { label: 'B', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  C: { label: 'C', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  descarte: { label: 'D', color: 'bg-red-100 text-red-700 border-red-200' },
};

export default function QualityControlList({ qualityControls, onQCClick }: QualityControlListProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (qualityControls.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Controles de Calidad</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay controles de calidad registrados</p>
        </div>
      </div>
    );
  }

  const passCount = qualityControls.filter(qc => qc.overallResult === 'pass').length;
  const failCount = qualityControls.filter(qc => qc.overallResult === 'fail').length;
  const passRate = qualityControls.length > 0
    ? ((passCount / qualityControls.length) * 100).toFixed(0)
    : '0';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Shield className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Controles de Calidad</h3>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="text-green-600 font-medium">{passCount} aprobados</span>
          {failCount > 0 && (
            <span className="text-red-600 font-medium">{failCount} rechazados</span>
          )}
          <span className="text-gray-500">({passRate}% tasa)</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {qualityControls.map((qc) => {
          const result = resultConfig[qc.overallResult];
          const ResultIcon = result.icon;
          const grade = gradeConfig[qc.finalGrade];

          return (
            <div
              key={qc.id}
              onClick={() => onQCClick?.(qc)}
              className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${result.bgColor} ${result.color}`}>
                      <ResultIcon className="w-3 h-3" />
                      {result.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${grade.color}`}>
                      Grado {grade.label}
                    </span>
                    {qc.approved ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-600">
                        Aprobado
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                        Pendiente
                      </span>
                    )}
                  </div>

                  <h4 className="font-medium text-gray-900">
                    Lote: {qc.batchCode}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(qc.inspectionDate)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {qc.inspector}
                    </span>
                  </div>
                </div>

                {qc.defectsFound && qc.defectsFound.length > 0 && (
                  <div className="flex-shrink-0">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-600">
                      {qc.defectsFound.length} defecto{qc.defectsFound.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {qc.notes && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 truncate">{qc.notes}</p>
                </div>
              )}

              {qc.approvedBy && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Aprobado por: <span className="font-medium text-gray-700">{qc.approvedBy}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
