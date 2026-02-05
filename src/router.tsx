import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/common/Layout/MainLayout';
import { ProtectedRoute } from './components/common/Auth';
import Login from './pages/Login';
import Finca from './pages/Finca';
import Pecuario from './pages/Pecuario';
import Agro from './pages/Agro';
import Finanzas from './pages/Finanzas';
import Procesamiento from './pages/Procesamiento';
import Reportes from './pages/Reportes';
import Reglamentos from './pages/Reglamentos';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/finca" replace />,
      },
      {
        path: 'finca',
        element: <Finca />,
      },
      {
        path: 'agro',
        element: <Agro />,
      },
      {
        path: 'pecuario',
        element: <Pecuario />,
      },
      {
        path: 'procesamiento',
        element: <Procesamiento />,
      },
      {
        path: 'finanzas',
        element: <Finanzas />,
      },
      {
        path: 'reportes',
        element: <Reportes />,
      },
      {
        path: 'reglamentos',
        element: <Reglamentos />,
      },
    ],
  },
]);
