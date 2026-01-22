import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Farm } from '../types/common.types';

interface FincaContextType {
  currentFinca: Farm | null;
  fincas: Farm[];
  setCurrentFinca: (finca: Farm) => void;
  isLoading: boolean;
}

const FincaContext = createContext<FincaContextType | undefined>(undefined);

// Mock data - Replace with actual API call
const mockFincas: Farm[] = [
  {
    id: '1',
    name: 'Finca El Roble',
    totalArea: 150,
    location: { lat: 10.3910, lng: -75.4794 },
    owner: 'Miguel Rodríguez',
  },
  {
    id: '2',
    name: 'Finca Las Brisas',
    totalArea: 200,
    location: { lat: 10.4000, lng: -75.5000 },
    owner: 'Miguel Rodríguez',
  },
  {
    id: '3',
    name: 'Finca La Esperanza',
    totalArea: 120,
    location: { lat: 10.3800, lng: -75.4600 },
    owner: 'Miguel Rodríguez',
  },
];

export function FincaProvider({ children }: { children: ReactNode }) {
  const [fincas, setFincas] = useState<Farm[]>([]);
  const [currentFinca, setCurrentFincaState] = useState<Farm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load fincas on mount
  useEffect(() => {
    const loadFincas = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setFincas(mockFincas);

        // Load saved finca from localStorage or default to first
        const savedFincaId = localStorage.getItem('currentFincaId');
        const fincaToSet = savedFincaId
          ? mockFincas.find(f => f.id === savedFincaId) || mockFincas[0]
          : mockFincas[0];

        setCurrentFincaState(fincaToSet);
      } catch (error) {
        console.error('Error loading fincas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFincas();
  }, []);

  // Save current finca to localStorage when it changes
  const setCurrentFinca = (finca: Farm) => {
    setCurrentFincaState(finca);
    localStorage.setItem('currentFincaId', finca.id);
  };

  return (
    <FincaContext.Provider
      value={{
        currentFinca,
        fincas,
        setCurrentFinca,
        isLoading,
      }}
    >
      {children}
    </FincaContext.Provider>
  );
}

export function useFinca() {
  const context = useContext(FincaContext);
  if (context === undefined) {
    throw new Error('useFinca must be used within a FincaProvider');
  }
  return context;
}
