import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  '': 'Mi Finca',
  'agro': 'Agricultura',
  'pecuario': 'Pecuario',
  'apicultura': 'Apicultura',
  'procesamiento': 'Procesamiento',
  'finanzas': 'Finanzas',
  'reportes': 'Reportes',
  'trabajadores': 'Trabajadores',
  'infraestructura': 'Infraestructura',
  'activos': 'Activos',
  'insumos': 'Insumos',
  'inventory': 'Inventario',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link
        to="/"
        className="group flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
      >
        <Home className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" strokeWidth={2} />
        <span className="font-semibold">Inicio</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = routeNames[value] || value;

        return (
          <div key={to} className="flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4 text-gray-300" strokeWidth={2.5} />
            {isLast ? (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-900 font-bold rounded-lg">
                {label}
              </span>
            ) : (
              <Link
                to={to}
                className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-semibold rounded-lg hover:bg-gray-100/80 transition-all duration-200"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
