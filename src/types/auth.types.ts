import type { BaseEntity, SystemModule } from './common.types';

// ========================================
// ROLES DEL SISTEMA
// ========================================

// Roles predefinidos según documento de requerimientos
export type UserRole = 'asociado' | 'administrador' | 'junta_directiva';

// Descripción de cada rol
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  asociado: 'Productores miembros de la Asociación que gestionan su(s) finca(s)',
  administrador: 'Usuarios responsables de la gestión operativa y administrativa a nivel institucional',
  junta_directiva: 'Usuarios con funciones de supervisión, control y consulta',
};

// ========================================
// USUARIO
// ========================================

export interface User extends BaseEntity {
  // Identificación
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;

  // Rol
  role: UserRole;

  // Para asociados: fincas asociadas
  associatedFincaIds?: string[];
  primaryFincaId?: string;

  // Estado
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: Date;

  // Configuración
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: 'es' | 'en';
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  defaultFincaId?: string;
}

// ========================================
// AUTENTICACIÓN
// ========================================

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ========================================
// PERMISOS POR MÓDULO
// ========================================

// Tipos de acciones posibles
export type PermissionAction =
  | 'view'           // Ver información
  | 'create'         // Crear registros
  | 'edit'           // Editar registros
  | 'delete'         // Eliminar registros
  | 'export'         // Exportar información
  | 'manage'         // Gestionar configuración
  | 'view_all'       // Ver información de todos los asociados
  | 'generate'       // Generar (reportes, etc.)
  | 'download';      // Descargar archivos

// Permisos específicos por módulo
export interface ModulePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  viewAll: boolean;      // Ver información de otros asociados
  manage: boolean;       // Gestión avanzada
}

// Permisos completos del sistema
export interface SystemPermissions {
  mi_finca: ModulePermissions & {
    manageDivisions: boolean;
    managePlanning: boolean;
    viewOthersFincas: boolean;
  };
  agricola: ModulePermissions & {
    manageActions: boolean;
    viewOthersActions: boolean;
  };
  pecuario: ModulePermissions & {
    manageLivestock: boolean;
    manageBeehives: boolean;
    managePotreros: boolean;
    manageHealth: boolean;
    manageReproduction: boolean;
    viewOthersData: boolean;
  };
  procesamiento: ModulePermissions & {
    manageBatches: boolean;
    manageProcessTypes: boolean;
    viewOthersBatches: boolean;
  };
  finanzas: ModulePermissions & {
    registerSales: boolean;
    viewSummary: boolean;
    viewConsolidated: boolean;
    exportOwn: boolean;
    exportAll: boolean;
  };
  reglamentos: ModulePermissions & {
    uploadOwn: boolean;
    uploadAny: boolean;
    deleteOwn: boolean;
    deleteAny: boolean;
    moveDocuments: boolean;
    manageCategories: boolean;
    accessAdminFolder: boolean;
    accessAllAssociateFolders: boolean;
  };
  reportes: ModulePermissions & {
    generateOwn: boolean;
    generateOthers: boolean;
    viewOwnHistory: boolean;
    viewAllHistory: boolean;
    downloadAny: boolean;
  };
}

// ========================================
// MATRIZ DE PERMISOS POR ROL
// ========================================

export const ROLE_PERMISSIONS: Record<UserRole, SystemPermissions> = {
  // ==================== ASOCIADO ====================
  asociado: {
    mi_finca: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: true,
      viewAll: false,
      manage: false,
      manageDivisions: true,
      managePlanning: true,
      viewOthersFincas: false,
    },
    agricola: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: true,
      viewAll: false,
      manage: false,
      manageActions: true,
      viewOthersActions: false,
    },
    pecuario: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: true,
      viewAll: false,
      manage: false,
      manageLivestock: true,
      manageBeehives: true,
      managePotreros: true,
      manageHealth: true,
      manageReproduction: true,
      viewOthersData: false,
    },
    procesamiento: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: true,
      viewAll: false,
      manage: false,
      manageBatches: true,
      manageProcessTypes: false,  // Solo admins
      viewOthersBatches: false,
    },
    finanzas: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: true,
      viewAll: false,
      manage: false,
      registerSales: true,
      viewSummary: true,
      viewConsolidated: false,
      exportOwn: true,
      exportAll: false,
    },
    reglamentos: {
      view: true,
      create: true,
      edit: false,
      delete: true,
      export: true,
      viewAll: false,
      manage: false,
      uploadOwn: true,
      uploadAny: false,
      deleteOwn: true,
      deleteAny: false,
      moveDocuments: false,
      manageCategories: false,
      accessAdminFolder: false,
      accessAllAssociateFolders: false,
    },
    reportes: {
      view: true,
      create: true,
      edit: false,
      delete: false,
      export: true,
      viewAll: false,
      manage: false,
      generateOwn: true,
      generateOthers: false,
      viewOwnHistory: true,
      viewAllHistory: false,
      downloadAny: false,
    },
  },

  // ==================== ADMINISTRADOR ====================
  administrador: {
    mi_finca: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      export: true,
      viewAll: true,
      manage: true,
      manageDivisions: true,
      managePlanning: true,
      viewOthersFincas: true,
    },
    agricola: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      export: true,
      viewAll: true,
      manage: true,
      manageActions: true,
      viewOthersActions: true,
    },
    pecuario: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      export: true,
      viewAll: true,
      manage: true,
      manageLivestock: true,
      manageBeehives: true,
      managePotreros: true,
      manageHealth: true,
      manageReproduction: true,
      viewOthersData: true,
    },
    procesamiento: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      export: true,
      viewAll: true,
      manage: true,
      manageBatches: true,
      manageProcessTypes: true,
      viewOthersBatches: true,
    },
    finanzas: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      export: true,
      viewAll: true,
      manage: true,
      registerSales: true,
      viewSummary: true,
      viewConsolidated: true,
      exportOwn: true,
      exportAll: true,
    },
    reglamentos: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      export: true,
      viewAll: true,
      manage: true,
      uploadOwn: true,
      uploadAny: true,
      deleteOwn: true,
      deleteAny: true,
      moveDocuments: true,
      manageCategories: true,
      accessAdminFolder: true,
      accessAllAssociateFolders: true,
    },
    reportes: {
      view: true,
      create: true,
      edit: false,
      delete: true,
      export: true,
      viewAll: true,
      manage: true,
      generateOwn: true,
      generateOthers: true,
      viewOwnHistory: true,
      viewAllHistory: true,
      downloadAny: true,
    },
  },

  // ==================== JUNTA DIRECTIVA ====================
  /**
   * Permisos de Junta Directiva - Rol de supervisión y control
   *
   * JUSTIFICACIÓN DE export: true en todos los módulos:
   * Según los requerimientos (Sección 5.3), la Junta Directiva tiene funciones
   * de supervisión y auditoría. Requieren acceso a exportaciones para:
   * - Generar informes consolidados para reuniones de asamblea
   * - Auditar operaciones de los asociados
   * - Preparar documentación para entidades reguladoras
   *
   * NOTA: Solo tienen permisos de lectura/exportación, NO pueden crear/editar/eliminar.
   */
  junta_directiva: {
    mi_finca: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: true,
      viewAll: true,
      manage: false,
      manageDivisions: false,
      managePlanning: false,
      viewOthersFincas: true,
    },
    agricola: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: true,
      viewAll: true,
      manage: false,
      manageActions: false,
      viewOthersActions: true,
    },
    pecuario: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: true,
      viewAll: true,
      manage: false,
      manageLivestock: false,
      manageBeehives: false,
      managePotreros: false,
      manageHealth: false,
      manageReproduction: false,
      viewOthersData: true,
    },
    procesamiento: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: true,
      viewAll: true,
      manage: false,
      manageBatches: false,
      manageProcessTypes: false,
      viewOthersBatches: true,
    },
    finanzas: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: true,
      viewAll: true,
      manage: false,
      registerSales: false,
      viewSummary: true,
      viewConsolidated: true,
      exportOwn: false,
      exportAll: true,
    },
    reglamentos: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: true,
      viewAll: false,
      manage: false,
      uploadOwn: false,
      uploadAny: false,
      deleteOwn: false,
      deleteAny: false,
      moveDocuments: false,
      manageCategories: false,
      accessAdminFolder: false,  // Por defecto, configurable
      accessAllAssociateFolders: false,
    },
    reportes: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: true,
      viewAll: true,
      manage: false,
      generateOwn: false,
      generateOthers: true,
      viewOwnHistory: false,
      viewAllHistory: true,
      downloadAny: true,
    },
  },
};

// ========================================
// HELPERS DE PERMISOS
// ========================================

// Mapear módulo a su clave canónica en SystemPermissions
const mapModuleToCanonical = (module: SystemModule): keyof SystemPermissions => {
  // 'agro' es alias de 'agricola', 'general' mapea a 'mi_finca'
  if (module === 'agro') return 'agricola';
  if (module === 'general') return 'mi_finca';
  // Los demás son directos
  return module as keyof SystemPermissions;
};

// Verificar si un rol tiene permiso para una acción en un módulo
export const hasPermission = (
  role: UserRole,
  module: SystemModule,
  action: keyof ModulePermissions
): boolean => {
  const permissions = ROLE_PERMISSIONS[role];
  const canonicalModule = mapModuleToCanonical(module);
  const modulePermissions = permissions[canonicalModule];
  return modulePermissions[action] ?? false;
};

// Verificar si un rol puede ver información de otros asociados
export const canViewOthersData = (role: UserRole): boolean => {
  return role === 'administrador' || role === 'junta_directiva';
};

// Verificar si un rol puede modificar información
export const canModifyData = (role: UserRole): boolean => {
  return role === 'asociado' || role === 'administrador';
};

// Verificar si un rol es de solo lectura
export const isReadOnlyRole = (role: UserRole): boolean => {
  return role === 'junta_directiva';
};

// ========================================
// RESUMEN DE PERMISOS POR ROL
// ========================================
//
// ASOCIADO:
// - Gestiona SU(S) finca(s) propias
// - Crea y edita acciones, inventarios, ventas propias
// - Genera reportes propios
// - Sube documentos a su carpeta
// - NO ve información de otros asociados
// - NO edita boletas directamente
// - NO accede a carpeta de Administración
//
// ADMINISTRADOR:
// - Acceso transversal a TODOS los asociados
// - Puede generar reportes por cualquier asociado
// - Gestiona categorías y documentos
// - Accede a todas las carpetas
// - Puede exportar información consolidada
// - Actúa como facilitador/soporte
//
// JUNTA DIRECTIVA:
// - SOLO LECTURA en general
// - Consulta información de todos los asociados
// - Descarga reportes para auditoría
// - Accede a Recursos compartidos
// - NO crea ni edita información productiva
// - NO sube ni elimina documentos

// ========================================
// RE-EXPORTS
// ========================================

// Re-exportar SystemModule para que otros módulos puedan importarlo desde auth.types
export type { SystemModule } from './common.types';
