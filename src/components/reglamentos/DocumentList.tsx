import { useState } from 'react';
import { FileText, Download, Calendar, Tag, Trash2, Eye } from 'lucide-react';
import { ConfirmModal } from '../common/Modals';
import type { Document } from '../../types/reglamentos.types';
import { useDeleteDocument } from '../../hooks/useReglamentos';

interface DocumentListProps {
  documents: Document[];
  isAdmin?: boolean;
}

// Category labels for display
const categoryLabels: Record<string, string> = {
  reglamentos: 'Reglamentos',
  leyes: 'Leyes y Decretos',
  manuales: 'Manuales Tecnicos',
  procedimientos: 'Procedimientos',
  certificaciones: 'Certificaciones',
  formatos: 'Formatos',
  otros: 'Otros',
};

// Category colors for styling
const categoryColors: Record<string, string> = {
  reglamentos: 'bg-blue-100 text-blue-700',
  leyes: 'bg-indigo-100 text-indigo-700',
  manuales: 'bg-green-100 text-green-700',
  procedimientos: 'bg-amber-100 text-amber-700',
  certificaciones: 'bg-purple-100 text-purple-700',
  formatos: 'bg-gray-100 text-gray-700',
  otros: 'bg-slate-100 text-slate-700',
};

// Helper to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function DocumentList({ documents, isAdmin = false }: DocumentListProps) {
  const deleteMutation = useDeleteDocument();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  const handleDownload = (doc: Document) => {
    // In a real app, this would trigger a file download
    console.log('Downloading:', doc.fileUrl);
    window.open(doc.fileUrl, '_blank');
  };

  const handleView = (doc: Document) => {
    window.open(doc.fileUrl, '_blank');
  };

  const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;
    try {
      await deleteMutation.mutateAsync(documentToDelete.id);
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setConfirmOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <>
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 p-3 bg-red-50 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {doc.description || ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleView(doc)}
                      className="flex-shrink-0 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver documento"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex-shrink-0 p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Descargar documento"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteClick(doc)}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar documento"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-4 mt-3">
                  {doc.categoryId && (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[doc.categoryId] || 'bg-gray-100 text-gray-700'}`}>
                      <Tag className="w-3 h-3" />
                      {doc.categoryName || categoryLabels[doc.categoryId] || doc.categoryId}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(doc.uploadedAt).toLocaleDateString('es-CR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {doc.fileSize > 0 && (
                    <span className="text-xs text-gray-400">
                      {formatFileSize(doc.fileSize)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <ConfirmModal
      open={confirmOpen}
      onOpenChange={setConfirmOpen}
      title="Eliminar Documento"
      description={`¿Desea eliminar el documento "${documentToDelete?.title}"?`}
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      onConfirm={handleConfirmDelete}
      isLoading={deleteMutation.isPending}
      variant="danger"
    />
    </>
  );
}
