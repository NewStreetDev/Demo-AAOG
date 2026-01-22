import { FileText, Award, ClipboardList } from 'lucide-react';
import type { AuditSummary } from '../../../types/dashboard.types';

interface DocumentsCardProps {
  auditSummary: AuditSummary;
}

export default function DocumentsCard({ auditSummary }: DocumentsCardProps) {
  return (
    <div className="card p-6 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-5">
        Documentos y Certificaciones
      </h3>

      {/* Action buttons */}
      <div className="space-y-3 flex-1">
        <button className="btn-primary w-full justify-start gap-3 py-3">
          <FileText className="w-5 h-5" strokeWidth={2} />
          <span>Generar Informe</span>
        </button>

        <button className="btn-secondary w-full justify-start gap-3 py-3">
          <Award className="w-5 h-5" strokeWidth={2} />
          <span>Ver Certificaciones</span>
        </button>
      </div>

      {/* Audit summary */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl ring-1 ring-amber-200/50">
          <div className="p-2 bg-amber-100 rounded-lg">
            <ClipboardList className="w-5 h-5 text-amber-600" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Auditorías: {auditSummary.inReview} en Revisión
            </p>
            <p className="text-xs text-amber-600">
              {auditSummary.approved} aprobadas, {auditSummary.pending} pendientes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
