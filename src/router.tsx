import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/common/Layout/MainLayout';
import Home from './pages/Home';

// Placeholder component for module dashboards
function ModulePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Módulo en Desarrollo</h3>
          <p className="text-gray-600">
            Este módulo está listo para ser implementado. La estructura base y los servicios están preparados.
          </p>
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'agro',
        children: [
          {
            index: true,
            element: <ModulePlaceholder
              title="Agricultura"
              description="Gestión de cultivos, planificación agrícola y seguimiento de cosechas"
            />
          },
        ],
      },
      {
        path: 'pecuario',
        children: [
          {
            index: true,
            element: <ModulePlaceholder
              title="Pecuario"
              description="Gestión de ganado, salud animal, reproducción y producción lechera"
            />
          },
          {
            path: 'inventory',
            element: <ModulePlaceholder
              title="Inventario de Ganado"
              description="Control detallado del inventario pecuario"
            />
          },
        ],
      },
      {
        path: 'apicultura',
        children: [
          {
            index: true,
            element: <ModulePlaceholder
              title="Apicultura"
              description="Gestión de apiarios, colmenas, producción de miel y derivados"
            />
          },
        ],
      },
      {
        path: 'procesamiento',
        children: [
          {
            index: true,
            element: <ModulePlaceholder
              title="Procesamiento"
              description="Gestión de procesamiento de productos de la finca"
            />
          },
        ],
      },
      {
        path: 'finanzas',
        children: [
          {
            index: true,
            element: <ModulePlaceholder
              title="Finanzas"
              description="Control financiero, ingresos, gastos y reportes contables"
            />
          },
        ],
      },
      {
        path: 'reportes',
        children: [
          {
            index: true,
            element: <ModulePlaceholder
              title="Reportes"
              description="Generación de reportes y análisis de datos"
            />
          },
        ],
      },
      {
        path: 'trabajadores',
        element: <ModulePlaceholder
          title="Trabajadores"
          description="Gestión de personal, roles y asignación de tareas"
        />,
      },
      {
        path: 'infraestructura',
        element: <ModulePlaceholder
          title="Infraestructura"
          description="Control de instalaciones y equipamiento de la finca"
        />,
      },
      {
        path: 'activos',
        element: <ModulePlaceholder
          title="Activos"
          description="Registro y seguimiento de activos de la finca"
        />,
      },
      {
        path: 'insumos',
        element: <ModulePlaceholder
          title="Insumos"
          description="Control de inventario de insumos y materiales"
        />,
      },
    ],
  },
]);
