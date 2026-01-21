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
    <nav className="flex items-center gap-2 text-sm">
      <Link
        to="/"
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Inicio</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = routeNames[value] || value;

        return (
          <div key={to} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 font-medium">{label}</span>
            ) : (
              <Link
                to={to}
                className="text-gray-600 hover:text-gray-900 transition-colors"
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
