import { useState, useMemo } from 'react';
import { BookOpen, Plus, FolderOpen, FolderLock, Share2, Search } from 'lucide-react';
import { DocumentList, DocumentFormModal } from '../components/reglamentos';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import { useDocuments } from '../hooks/useReglamentos';
import { useAuth } from '../contexts/AuthContext';
import { categoryOptions } from '../schemas/reglamentos.schema';
import type { DocumentFolder } from '../types/reglamentos.types';

type TabType = 'asociado' | 'administracion' | 'compartidos';

export default function Reglamentos() {
  const { data: documents, isLoading } = useDocuments();
  const { user } = useAuth();
  const [documentFormOpen, setDocumentFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('asociado');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const isAdmin = user?.role === 'admin';

  const tabs = [
    { id: 'asociado' as TabType, label: 'Mi Carpeta', icon: FolderOpen },
    ...(isAdmin
      ? [{ id: 'administracion' as TabType, label: 'Administracion', icon: FolderLock }]
      : []),
    { id: 'compartidos' as TabType, label: 'Recursos Compartidos', icon: Share2 },
  ];

  // Filter documents by active tab, search query, and category
  const filteredDocuments = useMemo(() => {
    if (!documents) return [];

    let filtered = documents.filter((doc) => doc.folder === activeTab);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((doc) => doc.category === categoryFilter);
    }

    return filtered;
  }, [documents, activeTab, searchQuery, categoryFilter]);

  // Determine if "Subir Documento" button should be visible
  const canUpload = isAdmin || activeTab === 'asociado';

  // Reset filters when switching tabs
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery('');
    setCategoryFilter('');
  };

  const emptyMessages: Record<TabType, { title: string; description: string }> = {
    asociado: {
      title: 'No hay documentos en tu carpeta',
      description: 'Sube tus documentos personales, certificaciones y registros aqui.',
    },
    administracion: {
      title: 'No hay documentos administrativos',
      description: 'Los documentos internos de administracion se almacenan aqui.',
    },
    compartidos: {
      title: 'No hay recursos compartidos',
      description: 'Los manuales, guias y documentos compartidos para todos los asociados aparecen aqui.',
    },
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Reglamentos
          </h1>
          <p className="text-sm text-gray-600">
            Gestion de documentos y normativas de la asociacion
          </p>
        </div>
        {canUpload && (
          <button
            onClick={() => setDocumentFormOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Subir Documento
          </button>
        )}
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
                onClick={() => handleTabChange(tab.id)}
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

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors sm:w-48"
        >
          <option value="">Todas las categorias</option>
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {isLoading ? (
          <ListCardSkeleton itemCount={4} />
        ) : filteredDocuments.length > 0 ? (
          <DocumentList documents={filteredDocuments} isAdmin={isAdmin} />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {emptyMessages[activeTab].title}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchQuery || categoryFilter
                ? 'No se encontraron documentos con los filtros aplicados.'
                : emptyMessages[activeTab].description}
            </p>
          </div>
        )}
      </div>

      {/* Admin / Upload Modals */}
      {canUpload && (
        <DocumentFormModal
          open={documentFormOpen}
          onOpenChange={setDocumentFormOpen}
          defaultFolder={activeTab as DocumentFolder}
        />
      )}
    </div>
  );
}
