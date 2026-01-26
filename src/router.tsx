import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/common/Layout/MainLayout';
import Home from './pages/Home';
import Finca from './pages/Finca';
import Apicultura from './pages/Apicultura';
import Pecuario from './pages/Pecuario';
import Agro from './pages/Agro';
import Insumos from './pages/Insumos';
import Finanzas from './pages/Finanzas';
import Procesamiento from './pages/Procesamiento';
import Reportes from './pages/Reportes';
import Trabajadores from './pages/Trabajadores';
import Infraestructura from './pages/Infraestructura';
import Activos from './pages/Activos';

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
        path: 'finca',
        children: [
          {
            index: true,
            element: <Finca />,
          },
        ],
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
        children: [
          {
            index: true,
            element: <Activos />,
          },
        ],
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
