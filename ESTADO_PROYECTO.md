# Estado del Proyecto AAOG - Sistema de Gestión Agrícola y Pecuaria

**Fecha:** 21 de Enero 2026
**Versión:** Fase 2 Completada
**Stack:** React 19 + Vite + TypeScript + Tailwind CSS + TanStack Query

---

## 📊 ESTADO ACTUAL

### ✅ Completado (Fase 1 + Fase 2)

#### **Fase 1: Correcciones Críticas**
- [x] Sistema de colores normalizado y consistente
- [x] Módulo de Apicultura agregado a la navegación
- [x] Header con breadcrumbs dinámicos y notificaciones
- [x] Dropdown de Administración mejorado (persistencia, UX)
- [x] Contexto FincaContext para multi-tenancy (3 fincas mock)
- [x] Selector de fincas en header

#### **Fase 2: Mejoras de Usabilidad (UX Playbook)**
- [x] Jerarquía visual mejorada (valores > labels)
- [x] Sistema de tipografía optimizado
- [x] Responsive design con breakpoints sm/md/lg
- [x] Componente EmptyState reutilizable
- [x] Cards rediseñados con iconos prominentes
- [x] Tap targets mínimos de 48x48px
- [x] Skeleton screens específicos
- [x] Spacing y proximity optimizados

### 🎨 Comparación UI Actual vs Mocks

#### ✅ **Coincide con Mocks:**
- Sidebar verde (#1e5631) con navegación principal
- Header con breadcrumbs y usuario
- Selector de finca (Finca Las Brisas)
- Cards de métricas con sparklines
- Resumen de Producción con iconos (Leche, Huevos, Miel, Carne)
- Estado de Insumos con indicadores de color
- Gráfico de actividades (pie chart)
- Lista de trabajadores con avatares
- Tareas pendientes
- Widget del clima

#### 🔄 **Diferencias Notables:**
1. **Panel General (Mock 2)**:
   - Mock muestra vista multi-finca con mapa
   - Actual: Solo vista single-finca (Dashboard "Mi Finca")
   - **Pendiente**: Implementar vista Panel General

2. **Iconografía**:
   - Actual: Usando Lucide Icons
   - Mock: Iconos más ilustrativos/decorativos
   - Estado: Aceptable, mantener consistencia

3. **Colores de las métricas**:
   - Actual: Sparklines con colores del sistema
   - Mock: Colores más variados
   - Estado: Correcto según sistema de diseño

---

## 📁 ESTRUCTURA DEL PROYECTO

```
aaog-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout/
│   │   │   │   └── MainLayout.tsx        # Layout principal con sidebar
│   │   │   ├── Cards/                    # Componentes de tarjetas
│   │   │   │   ├── StatCard.tsx         # Métricas principales
│   │   │   │   ├── ProductionCard.tsx   # Resumen de producción
│   │   │   │   ├── InventoryCard.tsx    # Estado de insumos
│   │   │   │   ├── ActivityChart.tsx    # Gráfico de actividades
│   │   │   │   ├── WorkerList.tsx       # Lista de trabajadores
│   │   │   │   ├── TaskList.tsx         # Tareas pendientes
│   │   │   │   └── WeatherWidget.tsx    # Widget del clima
│   │   │   ├── Skeletons/               # Loading states
│   │   │   │   ├── StatCardSkeleton.tsx
│   │   │   │   ├── ProductionCardSkeleton.tsx
│   │   │   │   ├── ChartSkeleton.tsx
│   │   │   │   └── ListCardSkeleton.tsx
│   │   │   ├── Breadcrumbs.tsx          # Navegación de contexto
│   │   │   ├── FincaSelector.tsx        # Selector de fincas
│   │   │   └── EmptyState.tsx           # Estado vacío reutilizable
│   │   └── [ÁREA LIBRE PARA MÓDULOS]    # Sin implementar aún
│   ├── contexts/
│   │   └── FincaContext.tsx             # Estado global de fincas
│   ├── hooks/
│   │   └── useDashboard.ts              # Hooks de React Query
│   ├── pages/
│   │   └── Home.tsx                     # Dashboard principal
│   ├── services/
│   │   ├── api/                         # [VACÍO] Servicios API reales
│   │   └── mock/
│   │       └── dashboard.mock.ts        # Datos mock actuales
│   ├── types/
│   │   ├── common.types.ts              # Tipos base (Farm, BaseEntity)
│   │   ├── dashboard.types.ts           # Tipos del dashboard
│   │   ├── agro.types.ts                # Tipos de agricultura
│   │   ├── pecuario.types.ts            # Tipos de pecuario
│   │   ├── apicultura.types.ts          # Tipos de apicultura
│   │   ├── finanzas.types.ts            # Tipos de finanzas
│   │   └── finca.types.ts               # Tipos de finca
│   ├── utils/
│   │   └── cn.ts                        # Utilidad para clases CSS
│   ├── router.tsx                       # Configuración de rutas
│   ├── App.tsx                          # Componente raíz
│   └── index.css                        # Estilos globales
├── tailwind.config.js                   # Configuración de Tailwind
├── vite.config.ts                       # Configuración de Vite
└── package.json                         # Dependencias
```

---

## 🛠️ TECNOLOGÍAS Y DEPENDENCIAS

### **Core**
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4

### **Routing & State**
- React Router v7.12.0
- TanStack Query 5.90.19 (data fetching)

### **UI/Styling**
- Tailwind CSS 4.1.18
- Lucide React 0.562.0 (iconos)
- Recharts 3.7.0 (gráficos)

### **Forms & Validation**
- React Hook Form 7.71.1
- Zod 4.3.5
- @hookform/resolvers 5.2.2

### **Maps**
- Leaflet 1.9.4
- React Leaflet 5.0.0

### **UI Components**
- Radix UI (Dialog, Dropdown, Select, Tabs)
- class-variance-authority
- tailwind-merge

---

## 🎨 SISTEMA DE DISEÑO

### **Paleta de Colores**

```javascript
// Brand Colors
primary: '#1e5631'      // Verde AAOG principal
primary-light: '#2d7a4a'
primary-dark: '#163f24'

// Module Colors
modules: {
  agricultura: '#10b981'
  pecuario: '#f97316'
  apicultura: '#fbbf24'
  procesamiento: '#7c3aed'
  finanzas: '#3b82f6'
}

// Status Colors
status: {
  success: '#22c55e'
  warning: '#f59e0b'
  danger: '#ef4444'
  info: '#3b82f6'
}

// Inventory Status
inventory: {
  stock: '#10b981'    // En stock
  low: '#f59e0b'      // Bajo
  critical: '#ef4444' // Crítico
}
```

### **Tipografía**

```
H1: text-3xl font-bold (30px) - Títulos de página
H2: text-2xl font-bold (24px) - Secciones principales
H3: text-lg font-semibold (18px) - Títulos de cards
Body: text-sm (14px) - Texto general
Caption: text-xs (12px) - Metadatos, labels
```

### **Spacing**
- Gap entre cards: `gap-4 md:gap-6` (16px móvil, 24px desktop)
- Padding de cards: `p-6` (24px)
- Padding de sidebar items: `px-4 py-3`

### **Responsive Breakpoints**
```
sm: 640px   (2 columnas)
md: 768px   (2 columnas)
lg: 1024px  (3-4 columnas)
```

---

## 🔀 GUÍA DE TRABAJO EN PARALELO

### **Estrategia: División por Módulos y Capas**

Para trabajar en paralelo sin conflictos, el proyecto está estructurado en capas independientes:

---

## 👤 ÁREAS DE TRABAJO - DESARROLLADOR A (Claude)

### **Responsabilidades:**
- **Componentes base reutilizables**: Badge, Modal, Tabs, DataTable
- **Layout y navegación**: Sidebar, header, breadcrumbs
- **Dashboard principal**: Home.tsx y mejoras visuales
- **Panel General**: Vista multi-finca con mapa
- **Sistema de diseño**: Tailwind, tipografía, colores

### **Archivos EXCLUSIVOS:**
```
src/components/common/
  ├── Layout/
  ├── Cards/
  ├── Skeletons/
  ├── Badge.tsx
  ├── Modal.tsx
  ├── Tabs.tsx
  ├── DataTable.tsx
  └── ...
src/pages/Home.tsx
src/pages/PanelGeneral.tsx
tailwind.config.js
src/index.css
```

### **Próximas Tareas:**
1. Implementar Panel General (vista multi-finca con mapa)
2. Crear componentes reutilizables (Badge, Modal, Tabs, DataTable)
3. Mejorar animaciones y micro-interacciones
4. Implementar responsive mobile optimizations

---

## 👤 ÁREAS DE TRABAJO - DESARROLLADOR B (Codex)

### **Responsabilidades:**
- **UI de Módulos**: Agricultura, Pecuario, Apicultura, Finanzas, Reportes
- **Componentes específicos**: CropCard, CattleCard, HiveCard, etc.
- **Formularios**: Con React Hook Form + Zod
- **Datos mock**: Crear archivos mock para cada módulo
- **Hooks**: useAgriculture, useLivestock, etc. con React Query

### **Archivos EXCLUSIVOS:**
```
src/pages/                   # ← MÓDULOS ESPECÍFICOS (NO Home.tsx)
  ├── Agriculture/
  ├── Livestock/
  ├── Apiculture/
  ├── Finance/
  └── Reports/

src/components/              # ← COMPONENTES ESPECÍFICOS
  ├── Agriculture/
  ├── Livestock/
  ├── Apiculture/
  ├── Finance/
  └── Reports/

src/services/mock/           # ← DATOS MOCK
  ├── agriculture.mock.ts
  ├── livestock.mock.ts
  ├── apiculture.mock.ts
  └── finance.mock.ts

src/hooks/                   # ← HOOKS PERSONALIZADOS
  ├── useAgriculture.ts
  ├── useLivestock.ts
  └── ...

src/types/                   # ← EXPANDIR TIPOS
  ├── agro.types.ts
  ├── pecuario.types.ts
  └── ...
```

### **Próximas Tareas:**
1. Implementar UI del módulo de Agricultura (dashboard, listas, formularios)
2. Implementar UI del módulo de Pecuario (inventario, salud animal)
3. Implementar UI del módulo de Apicultura (apiarios, colmenas)
4. Crear datos mock para todos los módulos
5. Implementar formularios con validación completa

**NOTA:** TODO es UI con datos mock. NO implementar backend por ahora.

---

## 🚫 REGLAS PARA EVITAR CONFLICTOS

### **1. NO Modificar Archivos del Otro Desarrollador**

**Desarrollador A (Claude) - NO TOCAR:**
- `src/services/api/*` (servicios API)
- `src/pages/*` (excepto Home.tsx)
- Lógica de negocio de módulos específicos

**Desarrollador B (Codex) - NO TOCAR:**
- `src/components/common/Layout/*`
- `src/components/common/Cards/*`
- `src/components/common/Skeletons/*`
- `tailwind.config.js` (consultar antes de modificar)
- `src/index.css` (consultar antes de modificar)

### **2. Comunicación de Cambios Compartidos**

**Archivos Compartidos (Requieren Coordinación):**
- `src/router.tsx` - Coordinar al agregar nuevas rutas
- `src/types/*` - Coordinar al modificar tipos existentes
- `src/contexts/*` - Coordinar al crear nuevos contextos
- `package.json` - Coordinar al agregar dependencias

**Protocolo:**
1. Notificar en chat antes de modificar archivos compartidos
2. Hacer cambios pequeños e incrementales
3. Hacer commits frecuentes con mensajes descriptivos
4. Pull antes de push para evitar conflictos

### **3. Convenciones de Commits**

```
feat: nueva funcionalidad
fix: corrección de bug
refactor: refactorización sin cambio de funcionalidad
style: cambios de estilo/formato
docs: cambios en documentación
test: agregar o modificar tests
chore: cambios en build, configs, etc.
```

**Ejemplos:**
```
feat(agriculture): add crop planting form
feat(dashboard): implement Panel General view
fix(livestock): correct inventory calculation
refactor(api): migrate to axios interceptors
```

### **4. Estructura de Branches (Recomendado)**

```
main                          # Código estable
├── feature/ui-components     # Desarrollador A
├── feature/agriculture       # Desarrollador B
├── feature/livestock         # Desarrollador B
└── feature/panel-general     # Desarrollador A
```

Hacer merge a `main` solo cuando la feature esté completa y probada.

---

## 📋 EJEMPLO DE WORKFLOW PARALELO

### **Escenario: Implementar Módulo de Agricultura**

#### **Desarrollador A (Claude) - UI:**
1. Crea estructura de layout en `src/pages/Agriculture/`
2. Crea componentes visuales:
   - `CropCard.tsx`
   - `PlantingCalendar.tsx`
   - `HarvestSummary.tsx`
3. Implementa navegación y breadcrumbs
4. Usa datos mock temporales

#### **Desarrollador B (Codex) - Backend/Logic:**
1. Crea servicio API en `src/services/api/agriculture.service.ts`
2. Define endpoints y métodos:
   ```typescript
   export const agricultureService = {
     getCrops: () => api.get('/crops'),
     createCrop: (data) => api.post('/crops', data),
     updateCrop: (id, data) => api.put(`/crops/${id}`, data),
   };
   ```
3. Crea hook `src/hooks/useAgriculture.ts`
4. Implementa lógica de formularios y validaciones

#### **Integración:**
1. Desarrollador A crea branch `feature/agriculture-ui`
2. Desarrollador B crea branch `feature/agriculture-api`
3. Se hace merge de ambas branches a `main` cuando estén listas
4. Desarrollador A reemplaza datos mock por servicios reales

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

### **Prioridad Alta (Semana 1-2)**

**Desarrollador A (Claude):**
- [ ] Implementar Panel General (vista multi-finca)
- [ ] Crear componentes base: Badge, Modal, Tabs
- [ ] Mejorar mobile responsiveness
- [ ] Implementar dark mode (opcional)

**Desarrollador B (Codex):**
- [ ] Configurar Axios y servicios API base
- [ ] Crear estructura de carpetas para módulos
- [ ] Implementar autenticación y autorización
- [ ] Configurar variables de entorno

### **Prioridad Media (Semana 3-4)**

**Desarrollador A (Claude):**
- [ ] Animaciones y transiciones
- [ ] Mejorar accesibilidad (WCAG AA)
- [ ] Optimizar performance
- [ ] Testing de componentes

**Desarrollador B (Codex):**
- [ ] Módulo de Agricultura completo
- [ ] Módulo de Pecuario: Inventario
- [ ] Módulo de Apicultura: Apiarios
- [ ] Formularios con validación completa

---

## 🔧 COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo (localhost:5174)

# Build
npm run build            # Compila para producción
npm run preview          # Preview del build

# Linting
npm run lint             # Ejecuta ESLint

# Git
git status               # Ver estado
git log --oneline        # Ver commits
git checkout -b feature/nombre  # Crear branch
git add .                # Staging
git commit -m "mensaje"  # Commit
git push origin branch   # Push a remote
```

---

## 📝 NOTAS IMPORTANTES

### **Estado de Datos Mock**
- Actualmente usando datos mock en `src/services/mock/dashboard.mock.ts`
- 3 fincas mock: El Roble, Las Brisas, La Esperanza
- Delay simulado de 300ms para imitar API

### **Contextos Globales**
- `FincaContext`: Gestiona finca activa y lista de fincas
- Persistencia en `localStorage`
- Hook: `useFinca()`

### **React Query**
- Configurado con staleTime de 5 minutos
- DevTools habilitadas en desarrollo
- Query keys en `src/hooks/useDashboard.ts`

### **Routing**
- React Router v7 con Data API
- Rutas anidadas con `children`
- Placeholders para módulos pendientes

---

## 🤝 COORDINACIÓN Y COMUNICACIÓN

### **¿Cuándo Coordinar?**
1. Antes de modificar archivos compartidos
2. Al agregar nuevas dependencias
3. Al cambiar estructura de carpetas
4. Al modificar tipos TypeScript existentes
5. Al hacer cambios en configuración (Vite, Tailwind, etc.)

### **¿Cómo Comunicar?**
- Chat directo antes del cambio
- Commits descriptivos
- Pull requests con descripción clara
- Documentar decisiones importantes en este archivo

---

## 📚 RECURSOS DE REFERENCIA

1. **Documentos del Proyecto:**
   - `/Users/ricardo/Desktop/Aso/Estructura del menu general del sistema AAOG.txt`
   - `/Users/ricardo/Desktop/Aso/Apicultura.txt`
   - UXPeak UI/UX Playbook (principios aplicados)

2. **Mocks de Diseño:**
   - `/Users/ricardo/Desktop/Aso/Mocks/` (2 imágenes de referencia)

3. **Repositorio:**
   - Directorio: `/Users/ricardo/Desktop/Aso/aaog-frontend`
   - Branch principal: `main`
   - 11 commits actuales

---

## ✅ CHECKLIST DE INICIO PARA CODEX

Antes de empezar a trabajar:

- [ ] Leer este documento completo
- [ ] Revisar estructura del proyecto
- [ ] Entender sistema de colores y diseño
- [ ] Verificar que el proyecto corre localmente (`npm run dev`)
- [ ] Crear branch de trabajo: `git checkout -b feature/nombre`
- [ ] Revisar archivos de tipos en `src/types/`
- [ ] Revisar datos mock para entender estructura de datos
- [ ] Identificar módulo a implementar primero
- [ ] Coordinar con Desarrollador A sobre archivos compartidos

---

**Última actualización:** 21 Enero 2026 - 4:55 PM
**Próxima revisión:** Al completar Fase 3 (Componentes Reutilizables)
