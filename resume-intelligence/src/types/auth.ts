export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  createdAt: string;
  savedResumesCount?: number;
}

export type AuthMode = 'login' | 'signup';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthMode;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; password?: string; role?: string }) => Promise<{ success: boolean; error?: string }>;
  loginWithDemo: (rolePreset?: 'developer' | 'designer' | 'manager') => void;
  logout: () => void;
}
