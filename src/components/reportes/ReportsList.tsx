import { ChevronRight, Download, Eye, FileText, Calendar, BarChart2 } from 'lucide-react';
import type { GeneratedReport } from '../../types/reportes.types';

interface ReportsListProps {
  reports: GeneratedReport[];
}

const reportTypeConfig = {
  comprehensive: { label: 'Integral', bg: 'bg-blue-100', text: 'text-blue-700' },
  financial: { label: 'Financiero', bg: 'bg-green-100', text: 'text-green-700' },
  production: { label: 'Producción', bg: 'bg-amber-100', text: 'text-amber-700' },
  inventory: { label: 'Inventario', bg: 'bg-purple-100', text: 'text-purple-700' },
};

const periodLabels = {
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  annual: 'Anual',
};

export default function ReportsList({ reports }: ReportsListProps) {
  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Reportes Generados
          </h3>
        </div>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Todos
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.length > 0 ? (
          reports.map((report) => {
            const typeConfig = reportTypeConfig[report.reportType];
            return (
              <div
                key={report.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Icon */}
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <BarChart2 className="w-4 h-4 text-gray-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {report.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.bg} ${typeConfig.text}`}>
                      {typeConfig.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {periodLabels[report.period]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString('es-CR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">No hay reportes generados</p>
        )}
      </div>
    </div>
  );
}
