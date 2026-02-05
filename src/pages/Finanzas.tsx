import { useState } from 'react';
import { Plus, ShoppingCart, BarChart3, FileSpreadsheet } from 'lucide-react';
import {
  SalesByModuleChart,
  SaleRecordFormModal,
  SaleRecordDetailModal,
} from '../components/finanzas';
import {
  useSalesByModule,
  useSalesRecords,
} from '../hooks/useFinanzas';
import type { SaleRecord } from '../types/finanzas.types';

type TabType = 'ventas' | 'resumen' | 'exportaciones';

export default function Finanzas() {
  const [activeTab, setActiveTab] = useState<TabType>('ventas');

  const { data: salesByModule, isLoading: moduleLoading } = useSalesByModule();
  const { data: sales, isLoading: salesLoading } = useSalesRecords();

  // Sale modals state
  const [saleFormOpen, setSaleFormOpen] = useState(false);
  const [saleDetailOpen, setSaleDetailOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);

  // Sale handlers
  const handleSaleClick = (sale: SaleRecord) => {
    setSelectedSale(sale);
    setSaleDetailOpen(true);
  };

  const handleSaleEdit = (sale: SaleRecord) => {
    setSelectedSale(sale);
    setSaleFormOpen(true);
  };

  const handleNewSale = () => {
    setSelectedSale(null);
    setSaleFormOpen(true);
  };

  const tabs = [
    { id: 'ventas' as TabType, label: 'Ventas', icon: ShoppingCart },
    { id: 'resumen' as TabType, label: 'Resumen', icon: BarChart3 },
    { id: 'exportaciones' as TabType, label: 'Exportaciones', icon: FileSpreadsheet },
  ];

  const getActionButtons = () => {
    switch (activeTab) {
      case 'ventas':
        return (
          <button
            onClick={handleNewSale}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Venta
          </button>
        );
      default:
        return null;
    }
  };

  // Calculate totals from sales
  const totalVentas = sales?.reduce((sum, s) => sum + s.totalAmount, 0) || 0;

  const ventasPorModulo = sales?.reduce((acc, sale) => {
    const mod = sale.moduleSource || 'agro';
    acc[mod] = (acc[mod] || 0) + sale.totalAmount;
    return acc;
  }, {} as Record<string, number>) || {};

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ventas':
        return (
          <div className="space-y-6">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Registro de Ventas</h3>
                <span className="text-sm text-gray-500">{sales?.length || 0} total</span>
              </div>
              {salesLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : sales && sales.length > 0 ? (
                <div className="space-y-2">
                  {sales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handleSaleClick(sale)}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{sale.productDescription || sale.invoiceNumber}</p>
                        <p className="text-sm text-gray-500">{sale.buyerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {sale.totalAmount.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(sale.date).toLocaleDateString('es-CR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 mb-4">No hay ventas registradas</p>
                  <button
                    onClick={handleNewSale}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Registrar Venta
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'resumen':
        return (
          <div className="space-y-6">
            {/* Total general */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-5 bg-green-50 border-green-200">
                <p className="text-sm text-green-600 font-medium">Total Ventas</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {totalVentas.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}
                </p>
                <p className="text-xs text-green-500 mt-1">Período actual</p>
              </div>
              <div className="card p-5">
                <p className="text-sm text-gray-600 font-medium">Ventas Agrícolas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(ventasPorModulo['agro'] || 0).toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}
                </p>
              </div>
              <div className="card p-5">
                <p className="text-sm text-gray-600 font-medium">Ventas Procesamiento</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(ventasPorModulo['procesamiento'] || 0).toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}
                </p>
              </div>
              <div className="card p-5">
                <p className="text-sm text-gray-600 font-medium">Ventas Pecuarias</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(ventasPorModulo['pecuario'] || 0).toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}
                </p>
              </div>
            </div>

            {/* Sales by Module Chart */}
            <div className="max-w-lg">
              {moduleLoading ? (
                <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
              ) : salesByModule ? (
                <SalesByModuleChart data={salesByModule} />
              ) : null}
            </div>
          </div>
        );

      case 'exportaciones':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Exportación de Datos de Ventas
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Exporte la información de ventas para uso en sistemas externos. Seleccione el formato deseado.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => alert('La exportación a Excel estará disponible próximamente.')}
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Exportar a Excel
                </button>
                <button
                  onClick={() => alert('La exportación a CSV estará disponible próximamente.')}
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Exportar a CSV
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Finanzas
          </h1>
          <p className="text-sm text-gray-600">
            Registro y consulta de ventas de la finca
          </p>
        </div>
        <div className="flex gap-2">
          {getActionButtons()}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-green-600 text-green-600'
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

      {/* Sale Modals */}
      <SaleRecordFormModal
        open={saleFormOpen}
        onOpenChange={setSaleFormOpen}
        saleRecord={selectedSale}
      />
      <SaleRecordDetailModal
        open={saleDetailOpen}
        onOpenChange={setSaleDetailOpen}
        saleRecord={selectedSale}
        onEdit={handleSaleEdit}
      />
    </div>
  );
}
