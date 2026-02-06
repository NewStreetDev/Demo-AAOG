import type { BaseEntity } from './common.types';
import type { UserRole } from './auth.types';

// ========================================
// ESTRUCTURA DE CARPETAS
// ========================================

// Tipos de carpeta principales
export type FolderType = 'asociado' | 'administracion' | 'compartidos';

// Carpeta del repositorio
export interface DocumentFolder extends BaseEntity {
  name: string;
  type: FolderType;

  // Para carpetas de asociado
  ownerId?: string;              // ID del asociado propietario
  ownerName?: string;            // Nombre del asociado

  // Estadísticas
  documentCount: number;
  totalSize: number;             // bytes
  lastUpdated?: Date;

  // Visibilidad
  visibleTo: ('asociado' | 'administrador' | 'junta_directiva')[];
}

// ========================================
// CATEGORÍAS (solo para Recursos compartidos)
// ========================================

export interface DocumentCategory extends BaseEntity {
  name: string;
  description?: string;
  order: number;                 // Para ordenar en UI
  documentCount: number;
  isActive: boolean;

  // Solo admins pueden gestionar categorías
  createdBy: string;
  createdByName: string;
}

// Categorías predefinidas sugeridas
export const DEFAULT_CATEGORIES = [
  'Reglamentos',
  'Leyes y Decretos',
  'Manuales Técnicos',
  'Procedimientos',
  'Certificaciones',
  'Formatos',
  'Otros'
] as const;

// ========================================
// DOCUMENTO
// ========================================

export interface Document extends BaseEntity {
  // Información básica
  title: string;                 // Nombre/título del documento
  description?: string;
  fileName: string;              // Nombre del archivo físico
  fileUrl: string;               // URL para descarga
  fileSize: number;              // bytes
  mimeType: 'application/pdf';   // Solo PDFs permitidos

  // Ubicación
  folderType: FolderType;
  folderId: string;              // ID de la carpeta
  categoryId?: string;           // Solo si folderType === 'compartidos'
  categoryName?: string;         // Denormalizado para búsqueda

  // Metadata
  uploadedAt: Date;
  uploadedBy: string;            // ID del usuario que subió
  uploadedByName: string;        // Nombre del usuario

  // Para carpetas de asociado
  associateId?: string;          // ID del asociado dueño (si aplica)
  associateName?: string;

  // Estado
  isActive: boolean;

  // Historial de movimiento (si fue compartido)
  movedToSharedAt?: Date;
  movedToSharedBy?: string;
  originalFolderType?: FolderType;
}

// ========================================
// SUBIDA DE DOCUMENTOS
// ========================================

export interface DocumentUpload {
  title: string;
  description?: string;
  file: File;                    // Archivo PDF
  folderType: FolderType;
  categoryId?: string;           // Requerido si folderType === 'compartidos'

  // Para admins subiendo a carpeta de asociado
  targetAssociateId?: string;
}

// Validación de archivo
export interface FileValidation {
  isValid: boolean;
  errors: string[];
  // Reglas:
  // - Solo PDF
  // - Tamaño máximo (configurable)
}

// ========================================
// MOVER DOCUMENTOS (solo admins)
// ========================================

export interface MoveDocumentRequest {
  documentId: string;
  targetFolderType: FolderType;
  targetCategoryId?: string;     // Si se mueve a compartidos
}

// Registro de movimiento
export interface DocumentMoveLog extends BaseEntity {
  documentId: string;
  documentTitle: string;
  fromFolderType: FolderType;
  toFolderType: FolderType;
  movedBy: string;
  movedByName: string;
  movedAt: Date;
  reason?: string;
}

// ========================================
// BÚSQUEDA Y NAVEGACIÓN
// ========================================

export interface DocumentSearchParams {
  query?: string;                // Búsqueda por nombre
  folderType?: FolderType;
  categoryId?: string;
  uploadedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'title' | 'uploadedAt' | 'fileSize';
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentSearchResult {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Vista de navegación por carpeta
export interface FolderView {
  folder: DocumentFolder;
  documents: Document[];
  categories?: DocumentCategory[]; // Solo si es 'compartidos'
  breadcrumb: { id: string; name: string }[];
}

// ========================================
// PERMISOS POR ROL (específicos de documentos)
// ========================================

export interface DocumentPermissions {
  canView: boolean;
  canUpload: boolean;
  canDelete: boolean;
  canMove: boolean;
  canManageCategories: boolean;
  canAccessAdminFolder: boolean;
  canAccessAllAssociateFolders: boolean;
}

// Permisos por rol
export const ROLE_PERMISSIONS: Record<UserRole, DocumentPermissions> = {
  asociado: {
    canView: true,
    canUpload: true,              // Solo en su carpeta
    canDelete: true,              // Solo sus documentos
    canMove: false,
    canManageCategories: false,
    canAccessAdminFolder: false,
    canAccessAllAssociateFolders: false,
  },
  administrador: {
    canView: true,
    canUpload: true,              // En cualquier carpeta
    canDelete: true,              // Cualquier documento
    canMove: true,
    canManageCategories: true,
    canAccessAdminFolder: true,
    canAccessAllAssociateFolders: true,
  },
  junta_directiva: {
    canView: true,
    canUpload: false,
    canDelete: false,
    canMove: false,
    canManageCategories: false,
    canAccessAdminFolder: false,  // Por defecto, puede cambiarse
    canAccessAllAssociateFolders: false,
  },
};

// ========================================
// ESTADÍSTICAS Y DASHBOARD
// ========================================

export interface ReglamentosDashboardStats {
  totalDocuments: number;
  totalSize: number;             // bytes

  // Por carpeta
  byFolder: {
    asociado: number;
    administracion: number;
    compartidos: number;
  };

  // Recursos compartidos por categoría
  sharedByCategory: {
    categoryId: string;
    categoryName: string;
    count: number;
  }[];

  // Actividad reciente
  recentUploads: number;         // Últimos 30 días
  recentDownloads: number;
}

// ========================================
// ACTIVIDAD/AUDITORÍA
// ========================================

export type DocumentAction = 'upload' | 'download' | 'delete' | 'move' | 'view';

export interface DocumentActivityLog extends BaseEntity {
  documentId: string;
  documentTitle: string;
  action: DocumentAction;
  performedBy: string;
  performedByName: string;
  performedAt: Date;
  details?: string;
  ipAddress?: string;
  fincaId?: string;             // Opcional para documentos de finca específica
}

// ========================================
// DESCARGA
// ========================================

export interface DownloadRequest {
  documentId: string;
  userId: string;
}

export interface DownloadResponse {
  url: string;
  fileName: string;
  expiresAt: Date;
}

// ========================================
// VISUALIZACIÓN EN LÍNEA (opcional)
// ========================================

export interface DocumentViewer {
  documentId: string;
  documentUrl: string;
  documentTitle: string;
  canDownload: boolean;
  canPrint: boolean;
}
