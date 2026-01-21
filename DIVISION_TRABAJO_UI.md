# División de Trabajo UI - Claude & Codex

**Objetivo:** Ambos trabajarán en UI/UX para que quede exactamente como los mocks
**Estrategia:** División por componentes y módulos para evitar conflictos

---

## 🎯 META FINAL: REPLICAR MOCKS EXACTAMENTE

### **Mock 1: Dashboard "Mi Finca"** ✅ 90% Completo
- Sidebar verde con navegación ✅
- Header con breadcrumbs y selector de finca ✅
- Cards de métricas con sparklines ✅
- Resumen de producción ✅
- Estado de insumos ✅
- Gráfico de actividades ✅
- Lista de trabajadores ✅
- Tareas pendientes ✅
- Widget del clima ✅

### **Mock 2: Panel General** ❌ Pendiente
- Vista multi-finca con mapa
- Métricas agregadas de todas las fincas
- Resumen de fincas individual
- Tareas pendientes generales
- Estadísticas generales
- Documentos y certificaciones

### **Mocks Pendientes:**
- Vistas de cada módulo específico (Agricultura, Pecuario, Apicultura, etc.)
- Formularios y modals
- Tablas de datos
- Páginas de detalle

---

## 👤 DIVISIÓN DE TRABAJO

### **DESARROLLADOR A: CLAUDE**

#### **Responsabilidad Principal:**
Componentes base, sistema de diseño, y vistas principales

#### **Tareas Específicas:**

1. **Panel General (Prioridad Alta)**
   ```
   src/pages/PanelGeneral.tsx
   src/components/common/Cards/FarmSummaryCard.tsx
   src/components/common/Cards/FarmMapCard.tsx
   src/components/common/Cards/GeneralStatsChart.tsx
   ```

2. **Componentes Reutilizables**
   ```
   src/components/common/Badge.tsx
   src/components/common/Modal.tsx
   src/components/common/Tabs.tsx
   src/components/common/DataTable.tsx
   src/components/common/Dropdown.tsx
   src/components/common/Tooltip.tsx
   ```

3. **Mejoras al Dashboard Actual**
   ```
   src/pages/Home.tsx (refinamientos)
   src/components/common/Cards/* (mejoras visuales)
   ```

4. **Layout y Navegación**
   ```
   src/components/common/Layout/MainLayout.tsx (refinamientos)
   src/components/common/Breadcrumbs.tsx (mejoras)
   src/components/common/FincaSelector.tsx (mejoras)
   ```

5. **Sistema de Diseño**
   ```
   tailwind.config.js (ajustes finales)
   src/index.css (estilos globales)
   ```

---

### **DESARROLLADOR B: CODEX**

#### **Responsabilidad Principal:**
Módulos específicos (Agricultura, Pecuario, Apicultura, etc.) - Solo UI con datos mock

#### **Tareas Específicas:**

1. **Módulo Agricultura (Prioridad Alta)**
   ```
   src/pages/Agriculture/
   ├── AgricultureDashboard.tsx
   ├── CropsList.tsx
   ├── CropDetail.tsx
   ├── CropForm.tsx (Modal o página)
   └── PlantingCalendar.tsx

   src/components/Agriculture/
   ├── CropCard.tsx
   ├── CropStats.tsx
   ├── HarvestSummary.tsx
   └── CropFilters.tsx

   src/services/mock/
   └── agriculture.mock.ts (datos mock)
   ```

2. **Módulo Pecuario (Prioridad Alta)**
   ```
   src/pages/Livestock/
   ├── LivestockDashboard.tsx
   ├── CattleInventory.tsx
   ├── CattleDetail.tsx
   ├── HealthRecords.tsx
   └── ProductionMilk.tsx

   src/components/Livestock/
   ├── CattleCard.tsx
   ├── HealthStatusBadge.tsx
   ├── MilkProductionChart.tsx
   └── CattleFilters.tsx

   src/services/mock/
   └── livestock.mock.ts
   ```

3. **Módulo Apicultura (Prioridad Media)**
   ```
   src/pages/Apiculture/
   ├── ApicultureDashboard.tsx
   ├── ApiaryList.tsx
   ├── HiveDetail.tsx
   └── HoneyProduction.tsx

   src/components/Apiculture/
   ├── HiveCard.tsx
   ├── HealthIndicator.tsx
   └── ProductionChart.tsx

   src/services/mock/
   └── apiculture.mock.ts
   ```

4. **Módulo Finanzas (Prioridad Media)**
   ```
   src/pages/Finance/
   ├── FinanceDashboard.tsx
   ├── IncomeExpenses.tsx
   ├── Transactions.tsx
   └── FinancialReports.tsx

   src/components/Finance/
   ├── TransactionCard.tsx
   ├── IncomeChart.tsx
   ├── ExpenseChart.tsx
   └── BudgetSummary.tsx

   src/services/mock/
   └── finance.mock.ts
   ```

5. **Módulo Reportes (Prioridad Baja)**
   ```
   src/pages/Reports/
   ├── ReportsDashboard.tsx
   ├── GenerateReport.tsx
   └── ReportHistory.tsx

   src/components/Reports/
   ├── ReportCard.tsx
   └── ReportFilters.tsx

   src/services/mock/
   └── reports.mock.ts
   ```

---

## 🚫 REGLAS PARA EVITAR CONFLICTOS

### **ARCHIVOS EXCLUSIVOS - NO TOCAR**

#### **Claude NO debe tocar:**
```
src/pages/Agriculture/**
src/pages/Livestock/**
src/pages/Apiculture/**
src/pages/Finance/**
src/pages/Reports/**
src/components/Agriculture/**
src/components/Livestock/**
src/components/Apiculture/**
src/components/Finance/**
src/components/Reports/**
src/services/mock/agriculture.mock.ts
src/services/mock/livestock.mock.ts
src/services/mock/apiculture.mock.ts
src/services/mock/finance.mock.ts
```

#### **Codex NO debe tocar:**
```
src/pages/Home.tsx
src/pages/PanelGeneral.tsx
src/components/common/Layout/**
src/components/common/Cards/** (excepto nuevos específicos)
src/components/common/Skeletons/**
src/components/common/Breadcrumbs.tsx
src/components/common/FincaSelector.tsx
src/components/common/EmptyState.tsx
tailwind.config.js (solo consultar)
src/index.css (solo consultar)
```

### **ARCHIVOS COMPARTIDOS - COORDINAR**

Estos archivos requieren comunicación antes de modificar:

```
src/router.tsx                    # Coordinar al agregar rutas
src/types/*                       # Coordinar al crear nuevos tipos
src/components/common/*.tsx       # Nuevos componentes base (coordinar)
package.json                      # Coordinar nuevas dependencias
```

**Protocolo:**
1. Avisar en chat: "Voy a agregar ruta X en router.tsx"
2. Esperar confirmación
3. Hacer el cambio
4. Commit y push inmediatamente

---

## 📋 WORKFLOW RECOMENDADO

### **PASO 1: Definir Qué Hacer**
Antes de empezar, coordinar en chat:
```
Claude: "Voy a trabajar en el Panel General"
Codex: "OK, yo empiezo con el módulo de Agricultura"
```

### **PASO 2: Crear Branch**
```bash
# Claude
git checkout -b feature/panel-general

# Codex
git checkout -b feature/agriculture-ui
```

### **PASO 3: Trabajar en Paralelo**
Cada uno en sus archivos exclusivos, sin conflictos.

### **PASO 4: Commits Frecuentes**
```bash
git add .
git commit -m "feat(agriculture): add crop listing UI with mock data"
git push origin feature/agriculture-ui
```

### **PASO 5: Merge a Main**
Cuando esté completo:
```bash
git checkout main
git pull origin main
git merge feature/agriculture-ui
git push origin main
```

**Importante:** Avisar al otro antes de hacer merge a main.

---

## 🎨 GUÍA DE ESTILO PARA AMBOS

### **Componentes Deben Seguir:**

1. **Estructura Consistente:**
```tsx
export default function ComponentName() {
  // 1. Hooks primero
  const { data, isLoading } = useData();

  // 2. Loading state
  if (isLoading) return <SkeletonComponent />;

  // 3. Empty state
  if (!data || data.length === 0) {
    return <EmptyState icon={Icon} title="..." />;
  }

  // 4. Main content
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Título</h1>
        <p className="text-sm text-gray-600">Descripción</p>
      </div>

      {/* Content */}
    </div>
  );
}
```

2. **Nombres de Clases:**
```tsx
// ✅ BIEN - Usar clases de Tailwind
<div className="bg-white rounded-lg shadow-sm p-6">

// ❌ MAL - No usar estilos inline
<div style={{ backgroundColor: 'white', padding: '24px' }}>
```

3. **Colores:**
```tsx
// ✅ Usar variables del sistema
bg-primary          // Verde principal
text-primary        // Verde principal
bg-status-success   // Verde éxito
bg-status-warning   // Amarillo advertencia
bg-status-danger    // Rojo peligro

// ❌ No hardcodear colores
bg-[#1e5631]       // Evitar
text-green-600     // Solo si no hay variable
```

4. **Spacing:**
```tsx
// Container principal
<div className="space-y-8">  // 32px entre secciones

// Headers
<div className="space-y-1">  // 4px entre título y descripción

// Cards grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

5. **Tipografía:**
```tsx
// Títulos de página
<h1 className="text-3xl font-bold text-gray-900">

// Títulos de sección
<h2 className="text-2xl font-bold text-gray-900">

// Títulos de cards
<h3 className="text-lg font-semibold text-gray-900">

// Labels pequeños
<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">

// Valores grandes
<p className="text-4xl font-bold text-gray-900">
```

6. **Buttons:**
```tsx
// Botón primario
<button className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">

// Botón secundario
<button className="px-4 py-2 bg-white border-2 border-primary text-primary font-medium rounded-lg hover:bg-gray-50">

// Botón ghost
<button className="px-3 py-2 text-primary hover:bg-gray-50 rounded-lg">
```

---

## 📊 CHECKLIST DE CALIDAD

Antes de hacer commit, verificar:

### **Visual:**
- [ ] ¿Se ve como el mock?
- [ ] ¿Los colores son correctos?
- [ ] ¿El spacing es consistente?
- [ ] ¿La tipografía sigue el sistema?
- [ ] ¿Los iconos son apropiados?

### **Responsive:**
- [ ] ¿Funciona en móvil (sm)?
- [ ] ¿Funciona en tablet (md)?
- [ ] ¿Funciona en desktop (lg)?
- [ ] ¿Los tap targets son 48x48px?

### **Estados:**
- [ ] ¿Hay skeleton para loading?
- [ ] ¿Hay EmptyState cuando no hay datos?
- [ ] ¿Los hover states funcionan?
- [ ] ¿Los errores se muestran?

### **Código:**
- [ ] ¿Está tipado con TypeScript?
- [ ] ¿Usa componentes reutilizables?
- [ ] ¿No hay console.logs?
- [ ] ¿El código es legible?

---

## 🗓️ PLAN DE IMPLEMENTACIÓN (4 Semanas)

### **Semana 1**

**Claude:**
- [ ] Componentes base (Badge, Modal, Tabs)
- [ ] Panel General - Estructura básica
- [ ] Mapa de fincas con Leaflet

**Codex:**
- [ ] Módulo Agricultura - Dashboard
- [ ] Módulo Agricultura - Lista de cultivos
- [ ] Módulo Agricultura - Formulario

### **Semana 2**

**Claude:**
- [ ] Panel General - Métricas agregadas
- [ ] Panel General - Gráficos
- [ ] Refinamiento de componentes base

**Codex:**
- [ ] Módulo Pecuario - Dashboard
- [ ] Módulo Pecuario - Inventario
- [ ] Módulo Pecuario - Ficha de animal

### **Semana 3**

**Claude:**
- [ ] Animaciones y transiciones
- [ ] Mobile optimization
- [ ] Refinamiento visual general

**Codex:**
- [ ] Módulo Apicultura - Dashboard
- [ ] Módulo Apicultura - Apiarios
- [ ] Módulo Finanzas - Dashboard

### **Semana 4**

**Claude:**
- [ ] Testing visual
- [ ] Ajustes finales
- [ ] Documentación

**Codex:**
- [ ] Módulo Finanzas - Transacciones
- [ ] Módulo Reportes - Dashboard
- [ ] Ajustes finales

---

## 💬 PROTOCOLO DE COMUNICACIÓN

### **Al Iniciar Trabajo:**
```
[Tu nombre]: Empezando con [componente/módulo]
```

### **Al Terminar Feature:**
```
[Tu nombre]: Terminé [componente/módulo]. Branch: feature/nombre
¿Puedo hacer merge a main?
```

### **Al Necesitar Coordinar:**
```
[Tu nombre]: Necesito modificar [archivo compartido] para [razón]
¿OK?
```

### **Al Encontrar Bug:**
```
[Tu nombre]: Bug encontrado en [componente].
¿Lo arreglo o prefieres que lo hagas tú?
```

---

## 🚀 COMANDOS ÚTILES

```bash
# Ver qué archivos están modificados
git status

# Ver diferencias antes de commit
git diff

# Ver ramas
git branch -a

# Cambiar de rama
git checkout nombre-branch

# Ver log de commits
git log --oneline --graph

# Deshacer cambios locales
git checkout -- archivo.tsx

# Ver quién modificó qué línea
git blame archivo.tsx

# Buscar en código
grep -r "searchTerm" src/
```

---

## 📝 DATOS MOCK - ESTRUCTURA

Cuando crees datos mock, seguir esta estructura:

```typescript
// src/services/mock/agriculture.mock.ts
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getMockCrops = async (farmId: string): Promise<Crop[]> => {
  await delay(300); // Simular latencia

  return [
    {
      id: '1',
      farmId,
      name: 'Maíz',
      variety: 'Híbrido DK7',
      plantingDate: new Date('2025-03-15'),
      area: 10.5,
      status: 'growing',
      expectedHarvest: new Date('2025-07-20'),
    },
    // ... más datos
  ];
};

export const getMockCropStats = async (farmId: string) => {
  await delay(300);

  return {
    totalCrops: 5,
    totalArea: 45.8,
    activeGrowing: 3,
    readyToHarvest: 2,
  };
};
```

---

## ✅ EJEMPLO DE COMPONENTE COMPLETO

```tsx
// src/pages/Agriculture/AgricultureDashboard.tsx
import { Plus, Sprout } from 'lucide-react';
import { useCrops, useCropStats } from '../../hooks/useAgriculture';
import EmptyState from '../../components/common/EmptyState';
import StatCardSkeleton from '../../components/common/Skeletons/StatCardSkeleton';
import CropCard from '../../components/Agriculture/CropCard';

export default function AgricultureDashboard() {
  const { data: crops, isLoading: cropsLoading } = useCrops();
  const { data: stats, isLoading: statsLoading } = useCropStats();

  // Loading state
  if (cropsLoading) {
    return (
      <div className="space-y-8">
        <div className="h-12 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // Empty state
  if (!crops || crops.length === 0) {
    return (
      <div className="space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Agricultura</h1>
          <p className="text-sm text-gray-600">
            Gestión de cultivos y producción agrícola
          </p>
        </div>

        <EmptyState
          icon={Sprout}
          title="No hay cultivos registrados"
          description="Comienza agregando tu primer cultivo para hacer seguimiento de la producción"
          actionLabel="Agregar Cultivo"
          onAction={() => console.log('Abrir modal')}
        />
      </div>
    );
  }

  // Main content
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Agricultura</h1>
          <p className="text-sm text-gray-600">
            Gestión de cultivos y producción agrícola
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
          <Plus className="w-5 h-5" />
          Nuevo Cultivo
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Total Cultivos
            </p>
            <p className="text-4xl font-bold text-gray-900">{stats.totalCrops}</p>
          </div>
          {/* ... más stats */}
        </div>
      )}

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {crops.map((crop) => (
          <CropCard key={crop.id} crop={crop} />
        ))}
      </div>
    </div>
  );
}
```

---

**¡LISTO PARA TRABAJAR EN PARALELO EN UI!** 🎨✨
