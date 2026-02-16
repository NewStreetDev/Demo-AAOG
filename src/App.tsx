import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { FincaProvider } from './contexts/FincaContext';
import { router } from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FincaProvider>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster position="top-right" richColors closeButton duration={4000} />
        </FincaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
