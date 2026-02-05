import { FileText, Download, Calendar, Tag, Trash2 } from 'lucide-react';
import type { Document } from '../../types/reglamentos.types';
import { useDeleteDocument } from '../../hooks/useReglamentos';

interface DocumentListProps {
  documents: Document[];
  isAdmin?: boolean;
}

const categoryLabels: Record<Document['category'], string> = {
  normativo: 'Normativo',
  tecnico: 'Tecnico',
  operativo: 'Operativo',
  certificacion: 'Certificacion',
};

const categoryColors: Record<Document['category'], string> = {
  normativo: 'bg-blue-100 text-blue-700',
  tecnico: 'bg-green-100 text-green-700',
  operativo: 'bg-amber-100 text-amber-700',
  certificacion: 'bg-purple-100 text-purple-700',
};

export default function DocumentList({ documents, isAdmin = false }: DocumentListProps) {
  const deleteMutation = useDeleteDocument();

  const handleDownload = (doc: Document) => {
    // In a real app, this would trigger a file download
    console.log('Downloading:', doc.fileUrl);
    window.open(doc.fileUrl, '_blank');
  };

  const handleDelete = async (doc: Document) => {
    if (window.confirm(`¿Desea eliminar el documento "${doc.name}"?`)) {
      try {
        await deleteMutation.mutateAsync(doc.id);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  return (
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
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {doc.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex-shrink-0 p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Descargar documento"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(doc)}
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
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[doc.category]}`}>
                    <Tag className="w-3 h-3" />
                    {categoryLabels[doc.category]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(doc.uploadedAt).toLocaleDateString('es-CR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {doc.fileSize && (
                    <span className="text-xs text-gray-400">
                      {doc.fileSize}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
