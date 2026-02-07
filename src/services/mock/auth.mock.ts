import type { User, LoginCredentials } from '../../types/auth.types';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Demo users
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'demo@aaog.com': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@aaog.com',
      name: 'Usuario Demo',
      firstName: 'Usuario',
      lastName: 'Demo',
      role: 'administrador',
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  },
  'admin@aaog.com': {
    password: 'admin123',
    user: {
      id: '2',
      email: 'admin@aaog.com',
      name: 'Administrador',
      firstName: 'Admin',
      lastName: 'AAOG',
      role: 'administrador',
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  },
  'asociado@aaog.com': {
    password: 'asociado123',
    user: {
      id: '3',
      email: 'asociado@aaog.com',
      name: 'Juan Asociado',
      firstName: 'Juan',
      lastName: 'Asociado',
      role: 'asociado',
      status: 'active',
      associatedFincaIds: ['1'],
      primaryFincaId: '1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  },
  'junta@aaog.com': {
    password: 'junta123',
    user: {
      id: '4',
      email: 'junta@aaog.com',
      name: 'Maria Directiva',
      firstName: 'Maria',
      lastName: 'Directiva',
      role: 'junta_directiva',
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  },
};

const AUTH_STORAGE_KEY = 'aaog_auth';

export const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  await delay(800); // Simulate network delay

  const account = DEMO_USERS[credentials.email.toLowerCase()];

  if (!account) {
    throw new Error('Usuario no encontrado');
  }

  if (account.password !== credentials.password) {
    throw new Error('Contrasena incorrecta');
  }

  // Store in localStorage
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account.user));

  return account.user;
};

export const mockLogout = async (): Promise<void> => {
  await delay(300);
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const mockGetCurrentUser = async (): Promise<User | null> => {
  await delay(200);
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }
  return null;
};
