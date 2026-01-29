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
      role: 'admin',
    },
  },
  'admin@aaog.com': {
    password: 'admin123',
    user: {
      id: '2',
      email: 'admin@aaog.com',
      name: 'Administrador',
      role: 'admin',
    },
  },
  'operador@aaog.com': {
    password: 'operador123',
    user: {
      id: '3',
      email: 'operador@aaog.com',
      name: 'Juan Operador',
      role: 'operator',
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
