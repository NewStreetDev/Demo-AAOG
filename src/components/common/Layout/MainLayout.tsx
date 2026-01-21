import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Sprout, Beef, Flower2, Factory, DollarSign, FileText, ChevronDown, Users, Building, Package, Box } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Mi Finca', href: '/', icon: Home },
  { name: 'Agricultura', href: '/agro', icon: Sprout },
  { name: 'Pecuario', href: '/pecuario', icon: Beef },
  { name: 'Apicultura', href: '/apicultura', icon: Flower2 },
  { name: 'Procesamiento', href: '/procesamiento', icon: Factory },
  { name: 'Finanzas', href: '/finanzas', icon: DollarSign },
  { name: 'Reportes', href: '/reportes', icon: FileText },
];

const administrationItems = [
  { name: 'Trabajadores', href: '/trabajadores', icon: Users },
  { name: 'Infraestructura', href: '/infraestructura', icon: Building },
  { name: 'Activos', href: '/activos', icon: Package },
  { name: 'Insumos', href: '/insumos', icon: Box },
];

export default function MainLayout() {
  const location = useLocation();
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white">
        <div className="flex items-center gap-2 h-16 px-6 border-b border-primary-light">
          <Home className="w-6 h-6" />
          <h1 className="text-xl font-bold">Mi Finca</h1>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href ||
                           (item.href !== '/' && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-light text-white'
                    : 'text-green-100 hover:bg-primary-light/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Administration Dropdown */}
          <div>
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors text-green-100 hover:bg-primary-light/50"
            >
              <div className="flex items-center gap-3">
                <ChevronDown className={`w-5 h-5 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
                <span className="font-medium">Administración</span>
              </div>
            </button>
            {adminOpen && (
              <div className="mt-1 ml-4 space-y-1">
                {administrationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                        isActive
                          ? 'bg-primary-light text-white'
                          : 'text-green-100 hover:bg-primary-light/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">OneDrive images as 34,265,24 GB of 49 BPNG</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                M
              </div>
              <span className="text-sm font-medium text-gray-700">Miguel</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
