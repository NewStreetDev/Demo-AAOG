import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Sprout, Beef, Factory, DollarSign, ChevronDown, Bell, User, Map, LogOut, BookOpen, BarChart3 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Breadcrumbs from '../Breadcrumbs';
import FincaSelector from '../FincaSelector';
import { useAuth } from '../../../contexts/AuthContext';

const navigation = [
  { name: 'Mi Finca', href: '/finca', icon: Map },
  { name: 'Agrícola', href: '/agro', icon: Sprout },
  { name: 'Pecuario', href: '/pecuario', icon: Beef },
  { name: 'Procesamiento', href: '/procesamiento', icon: Factory },
  { name: 'Finanzas', href: '/finanzas', icon: DollarSign },
  { name: 'Reglamentos', href: '/reglamentos', icon: BookOpen },
  { name: 'Reportes y Análisis', href: '/reportes', icon: BarChart3 },
];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';
  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    manager: 'Gerente',
    operator: 'Operador',
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Premium Sidebar with glass-morphism */}
      <aside className="w-64 bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-2xl relative overflow-hidden">
        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-10 pattern-dots" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />

        {/* Logo header */}
        <div className="relative flex items-center gap-3 h-16 px-6 border-b border-white/10 backdrop-blur-sm bg-white/5">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
            <Home className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Mi Finca</h1>
            <p className="text-xs text-green-100/80 font-medium">AAOG Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative p-4 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href ||
                           (item.href !== '/' && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/20'
                    : 'text-green-50 hover:bg-white/10 hover:text-white hover:translate-x-1'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={2} />
                <span className="font-semibold">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}

        </nav>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Premium Header with glass-morphism */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 flex items-center justify-between px-8 shadow-sm relative z-10">
          <Breadcrumbs />

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Finca Selector */}
            <div className="mr-2">
              <FincaSelector />
            </div>

            {/* Notifications */}
            <button
              className="group relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5" strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              {/* Notification badge with animation */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white scale-0 group-hover:scale-100 transition-transform">
                3
              </span>
            </button>

            {/* Settings */}
            <button
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105 hover:rotate-90"
              aria-label="Configuración"
            >
              <User className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200 mx-2" />

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="group flex items-center gap-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-all duration-200 hover:shadow-sm"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-green-100 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
                    {userInitial}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">{user?.name || 'Usuario'}</p>
                  <p className="text-xs text-gray-500">{roleLabels[user?.role || 'operator']}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
              </button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content with premium background */}
        <main className="flex-1 overflow-auto p-8 bg-gradient-to-br from-gray-50 via-gray-50/50 to-gray-100/50">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
