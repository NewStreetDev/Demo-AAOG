import { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { DocumentList, DocumentFormModal } from '../components/reglamentos';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import { useDocuments } from '../hooks/useReglamentos';
import { useAuth } from '../contexts/AuthContext';

export default function Reglamentos() {
  const { data: documents, isLoading } = useDocuments();
  const { user } = useAuth();
  const [documentFormOpen, setDocumentFormOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Reglamentos
          </h1>
          <p className="text-sm text-gray-600">
            Documentos normativos, manuales técnicos y guías de certificación
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setDocumentFormOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Documento
          </button>
        )}
      </div>

      {/* Document List */}
      {isLoading ? (
        <ListCardSkeleton itemCount={6} />
      ) : documents && documents.length > 0 ? (
        <DocumentList documents={documents} isAdmin={isAdmin} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No hay documentos disponibles</p>
        </div>
      )}

      {/* Admin Modals */}
      {isAdmin && (
        <DocumentFormModal
          open={documentFormOpen}
          onOpenChange={setDocumentFormOpen}
        />
      )}
    </div>
  );
}
