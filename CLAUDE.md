# CLAUDE.md - Demo AAOG

## Proyecto

**aaog-frontend** - Sistema de gestion integral para la Asociacion de Agricultores Organicos de Grecia (AAOG). App demo con datos mock, branch de trabajo: `entrega-1`.

## Stack

- **React 19** + **TypeScript** (strict) + **Vite 7**
- **TanStack Query v5** - server state & cache
- **react-hook-form v7** + **Zod v4** - formularios y validacion
- **Radix UI** - headless components (Dialog, Select, DropdownMenu, Checkbox, Tabs)
- **Tailwind CSS v4** + `cn()` utility (clsx + tailwind-merge)
- **Sonner** - toast notifications
- **Lucide React** - iconos
- **Recharts** - graficas
- **React Leaflet** - mapas

## Comandos

```bash
npm run dev        # Dev server (Vite)
npm run build      # tsc -b && vite build
npx tsc --noEmit   # Type check sin emitir
npx vite build     # Build de produccion
```

## Estructura src/

```
src/
  pages/           # Paginas principales (Login, Finca, Agro, Pecuario, etc.)
  components/
    common/        # Compartidos: Forms/, Modals/, Layout/, Calendar/, Tables/, Skeletons/
    finca/         # Mi Finca: divisiones, planes, plan anual
    agro/          # Agricola: cultivos, cosechas, lotes, acciones
    pecuario/      # Pecuario: ganado, apiario, salud, reproduccion
    procesamiento/ # Procesamiento: lotes de procesamiento
    finanzas/      # Finanzas: ventas, compras
    reglamentos/   # Reglamentos: documentos normativos
    reportes/      # Reportes: generacion y historial
  hooks/           # Custom hooks (useQuery + useMutation por modulo)
  schemas/         # Zod schemas + options arrays para selects
  types/           # TypeScript interfaces/types por modulo
  services/mock/   # Mock stores con CRUD (datos en memoria)
  contexts/        # AuthContext, FincaContext
  utils/           # cn() utility
  router.tsx       # Rutas con react-router-dom v7
  App.tsx          # Providers: QueryClient, Auth, Finca, Toaster
```

## Rutas

```
/login                  # Login (publico)
/finca                  # Mi Finca (default redirect desde /)
/agro                   # Agricola
/pecuario               # Pecuario
/procesamiento          # Procesamiento
/finanzas               # Finanzas
/reglamentos            # Reglamentos y documentos
/reportes               # Reportes y analisis
```

## Patrones clave

### Formularios: Schema -> Form -> Modal

```typescript
// 1. Schema (src/schemas/finca.schema.ts)
export const fincaFormSchema = z.object({
  name: z.string().min(2, 'Minimo 2 caracteres'),
  status: z.enum(fincaStatuses),
});
export type FincaFormData = z.infer<typeof fincaFormSchema>;
export const fincaStatusOptions = [{ value: 'active', label: 'Activa' }];

// 2. Form Modal (src/components/finca/FincaFormModal.tsx)
const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FincaFormData>({
  resolver: zodResolver(fincaFormSchema),
});

// 3. Inputs: register para texto, Controller para selects/custom
<FormInput {...register('name')} error={errors.name?.message} />
<Controller name="status" control={control} render={({ field }) => (
  <FormSelect value={field.value} onValueChange={field.onChange} options={fincaStatusOptions} />
)} />
```

### Mutations: Hook -> Toast -> Invalidate

```typescript
// src/hooks/useFincaMutations.ts
export function useUpdateFinca() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FincaFormData) => updateMockFinca(data),
    onSuccess: () => {
      toast.success('Finca actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['finca'] });
    },
    onError: () => { toast.error('Error al actualizar'); },
  });
}
```

### Mock Services: Store en memoria

```typescript
// src/services/mock/finca.mock.ts
let store: Finca[] = [/* datos iniciales */];
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function getMockFinca() { await delay(100); return store; }
export async function createMockFinca(data) { await delay(200); /* push to store */ }
```

### Componentes comunes

| Componente | Uso |
|---|---|
| `FormInput` | Input con error styling via `register()` |
| `FormField` | Wrapper: label + required asterisk + children + error |
| `FormSelect` | Radix Select con opciones `{value, label}[]` |
| `FormMultiSelect` | Multi-select con Radix DropdownMenu.CheckboxItem |
| `FormFileUpload` | Drop zone con drag&drop, FileReader, preview |
| `FormTextArea` | Textarea con error styling |
| `Modal` | Base modal con Radix Dialog (sizes: sm/md/lg/xl) |
| `ConfirmModal` | Dialogo de confirmacion con variantes (danger/default) |

### Estilos

- **Botones**: `btn-primary` (verde), `btn-secondary` (gris)
- **Colores modulo**: verde=agricola, amber=pecuario, blue=procesamiento, green=general
- **cn()**: `import { cn } from '../utils/cn'` para merge de clases condicionales
- **UI en espanol**: todos los textos, errores y placeholders

## Modulos

| Modulo | Pagina | Schemas | Mock | Hooks |
|---|---|---|---|---|
| Mi Finca | Finca.tsx | finca.schema.ts | finca.mock.ts | useFinca, useFincaMutations |
| Agricola | Agro.tsx | agro.schema.ts | agro.mock.ts | useAgro*, useAgroMutations |
| Pecuario | Pecuario.tsx | pecuario.schema.ts | pecuario.mock.ts | usePecuario*, usePecuarioMutations |
| Procesamiento | Procesamiento.tsx | procesamiento.schema.ts | procesamiento.mock.ts | useProcesamiento* |
| Finanzas | Finanzas.tsx | finanzas.schema.ts | finanzas.mock.ts | useFinanzas* |
| Reglamentos | Reglamentos.tsx | reglamentos.schema.ts | reglamentos.mock.ts (via hooks) | useReglamentos |
| Reportes | Reportes.tsx | - | reportes.mock.ts | useReportes |

## Auth

- Mock auth via `AuthContext` + `ProtectedRoute`
- Roles: `asociado`, `administrador`, `junta_directiva`
- Permisos por rol definidos en types (ej: `REPORT_ROLE_PERMISSIONS`)
- Login con credenciales demo hardcoded en mock

## Notas importantes

- **No hay backend real** - todo es mock data en memoria, se pierde al recargar
- **No hay notificaciones** - no existe sistema de notificaciones
- **Branch de trabajo**: `entrega-1` (merge a `main`)
- **Validacion**: siempre con Zod schemas, mensajes en espanol
- **Confirmaciones**: usar `ConfirmModal`, nunca `window.confirm`
- **Toasts**: usar `toast.success/error` de Sonner, nunca `alert()`
- **Iconos**: solo de `lucide-react`
