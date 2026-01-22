import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/common/Layout/MainLayout';
import Home from './pages/Home';
import Apicultura from './pages/Apicultura';
import Pecuario from './pages/Pecuario';
import Agro from './pages/Agro';
import Insumos from './pages/Insumos';
import Finanzas from './pages/Finanzas';
import Procesamiento from './pages/Procesamiento';
import Reportes from './pages/Reportes';
import Trabajadores from './pages/Trabajadores';
import Infraestructura from './pages/Infraestructura';

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
            element: <Agro />,
          },
        ],
      },
      {
        path: 'pecuario',
        children: [
          {
            index: true,
            element: <Pecuario />,
          },
        ],
      },
      {
        path: 'apicultura',
        children: [
          {
            index: true,
            element: <Apicultura />,
          },
        ],
      },
      {
        path: 'procesamiento',
        children: [
          {
            index: true,
            element: <Procesamiento />,
          },
        ],
      },
      {
        path: 'finanzas',
        children: [
          {
            index: true,
            element: <Finanzas />,
          },
        ],
      },
      {
        path: 'reportes',
        children: [
          {
            index: true,
            element: <Reportes />,
          },
        ],
      },
      {
        path: 'trabajadores',
        children: [
          {
            index: true,
            element: <Trabajadores />,
          },
        ],
      },
      {
        path: 'infraestructura',
        children: [
          {
            index: true,
            element: <Infraestructura />,
          },
        ],
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
        children: [
          {
            index: true,
            element: <Insumos />,
          },
        ],
      },
    ],
  },
]);
