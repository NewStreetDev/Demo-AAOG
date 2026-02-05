import { useState, useMemo } from 'react';
import { FilePlus, History, FileText, Download, Sprout, Beef, Factory, Filter } from 'lucide-react';
import {
  ReportsList,
} from '../components/reportes';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useGeneratedReports,
} from '../hooks/useReportes';

type TabType = 'generar' | 'historial';

interface ReportType {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'agricola' | 'pecuario' | 'procesamiento';
  icon: typeof FileText;
}

const reportTypes: ReportType[] = [
  // Registros Agrícolas
  { id: 'rg01', code: 'RG01', name: 'Plan de Manejo', description: 'Plan de manejo de la finca orgánica', category: 'agricola', icon: Sprout },
  { id: 'rg02', code: 'RG02', name: 'Estimación de Producción', description: 'Estimación de producción agrícola por período', category: 'agricola', icon: Sprout },
  { id: 'rg03', code: 'RG03', name: 'Bitácora de Labores', description: 'Registro de labores realizadas en la finca', category: 'agricola', icon: Sprout },
  { id: 'rg04', code: 'RG04', name: 'Insumos', description: 'Registro de insumos utilizados', category: 'agricola', icon: Sprout },
  { id: 'rg05', code: 'RG05', name: 'Registro de Cosechas', description: 'Registro de cosechas realizadas', category: 'agricola', icon: Sprout },
  { id: 'balance', code: 'BAL', name: 'Balance de Masas', description: 'Balance de entradas y salidas de productos', category: 'agricola', icon: Sprout },
  // Registros Pecuarios
  { id: 'rp03', code: 'RP03', name: 'Identificación del Hato', description: 'Inventario e identificación del hato ganadero', category: 'pecuario', icon: Beef },
  { id: 'rp02', code: 'RP02', name: 'Sanidad Animal', description: 'Registro sanitario y de vacunaciones', category: 'pecuario', icon: Beef },
  { id: 'rp04', code: 'RP04', name: 'Reproducción y Control de Partos', description: 'Registro reproductivo y control de partos', category: 'pecuario', icon: Beef },
  // Registros de Procesamiento
  { id: 'rg06', code: 'RG06', name: 'Registro de Procesamiento de Productos Orgánicos', description: 'Registro de procesos de transformación de productos', category: 'procesamiento', icon: Factory },
  { id: 'rg07', code: 'RG07', name: 'Venta de Productos Procesados', description: 'Registro de ventas de productos procesados', category: 'procesamiento', icon: Factory },
];

const categoryLabels: Record<ReportType['category'], string> = {
  agricola: 'Agrícola',
  pecuario: 'Pecuario',
  procesamiento: 'Procesamiento',
};

const categoryColors: Record<ReportType['category'], string> = {
  agricola: 'bg-green-100 text-green-700',
  pecuario: 'bg-amber-100 text-amber-700',
  procesamiento: 'bg-blue-100 text-blue-700',
};

type HistorialReportType = 'all' | 'comprehensive' | 'financial' | 'production' | 'inventory';
type HistorialPeriod = 'all' | 'monthly' | 'quarterly' | 'annual';

const historialReportTypeLabels: Record<HistorialReportType, string> = {
  all: 'Todos los tipos',
  comprehensive: 'Integral',
  financial: 'Financiero',
  production: 'Producción',
  inventory: 'Inventario',
};

const historialPeriodLabels: Record<HistorialPeriod, string> = {
  all: 'Todos los períodos',
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  annual: 'Anual',
};

export default function Reportes() {
  const [activeTab, setActiveTab] = useState<TabType>('generar');
  const [selectedCategory, setSelectedCategory] = useState<ReportType['category'] | 'all'>('all');

  // Historial filters
  const [historialTypeFilter, setHistorialTypeFilter] = useState<HistorialReportType>('all');
  const [historialPeriodFilter, setHistorialPeriodFilter] = useState<HistorialPeriod>('all');

  const { data: reports, isLoading: reportsLoading } = useGeneratedReports();

  // Filter reports based on selected filters
  const filteredReports = useMemo(() => {
    if (!reports) return [];
    return reports.filter((report) => {
      const matchesType = historialTypeFilter === 'all' || report.reportType === historialTypeFilter;
      const matchesPeriod = historialPeriodFilter === 'all' || report.period === historialPeriodFilter;
      return matchesType && matchesPeriod;
    });
  }, [reports, historialTypeFilter, historialPeriodFilter]);

  const tabs = [
    { id: 'generar' as TabType, label: 'Generar Reportes', icon: FilePlus },
    { id: 'historial' as TabType, label: 'Historial de Reportes', icon: History },
  ];

  const filteredReportTypes = selectedCategory === 'all'
    ? reportTypes
    : reportTypes.filter(r => r.category === selectedCategory);

  const handleGenerateReport = (reportType: ReportType) => {
    // In a real app, this would trigger report generation
    console.log('Generating report:', reportType.code);
    alert(`Generando reporte: ${reportType.name}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generar':
        return (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {(Object.keys(categoryLabels) as ReportType['category'][]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>

            {/* Report Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReportTypes.map((reportType) => {
                const Icon = reportType.icon;
                return (
                  <div
                    key={reportType.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <span className="text-xs font-mono text-gray-400">{reportType.code}</span>
                          <h3 className="font-semibold text-gray-900">{reportType.name}</h3>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[reportType.category]}`}>
                        {categoryLabels[reportType.category]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{reportType.description}</p>
                    <button
                      onClick={() => handleGenerateReport(reportType)}
                      className="w-full btn-secondary inline-flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Generar Reporte
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'historial':
        return (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtros</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={historialTypeFilter}
                  onChange={(e) => setHistorialTypeFilter(e.target.value as HistorialReportType)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {(Object.keys(historialReportTypeLabels) as HistorialReportType[]).map((type) => (
                    <option key={type} value={type}>
                      {historialReportTypeLabels[type]}
                    </option>
                  ))}
                </select>
                <select
                  value={historialPeriodFilter}
                  onChange={(e) => setHistorialPeriodFilter(e.target.value as HistorialPeriod)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {(Object.keys(historialPeriodLabels) as HistorialPeriod[]).map((period) => (
                    <option key={period} value={period}>
                      {historialPeriodLabels[period]}
                    </option>
                  ))}
                </select>
                {(historialTypeFilter !== 'all' || historialPeriodFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setHistorialTypeFilter('all');
                      setHistorialPeriodFilter('all');
                    }}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            {/* Results count */}
            {reports && (
              <p className="text-sm text-gray-500">
                Mostrando {filteredReports.length} de {reports.length} reportes
              </p>
            )}

            {/* Reports list */}
            {reportsLoading ? (
              <ListCardSkeleton itemCount={5} />
            ) : filteredReports.length > 0 ? (
              <ReportsList reports={filteredReports} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">
                  {reports && reports.length > 0
                    ? 'No hay reportes que coincidan con los filtros seleccionados'
                    : 'No hay reportes generados'}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Reportes e Informes
        </h1>
        <p className="text-sm text-gray-600">
          Generación de reportes y consolidación de datos de la finca
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {renderTabContent()}
      </div>
    </div>
  );
}
