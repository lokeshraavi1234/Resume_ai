'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthMode, AuthContextType } from '@/types/auth';
import { validateEmail, validatePassword } from '@/lib/auth-validation';

interface RegisteredAccount extends User {
  passwordHash: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'resume_ai_current_user';
const REGISTERED_USERS_KEY = 'resume_ai_registered_accounts';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load user from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (mode: AuthMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Helper to get registered accounts map
  const getRegisteredAccounts = (): Record<string, RegisteredAccount> => {
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  // Helper to save registered accounts map
  const saveRegisteredAccounts = (accounts: Record<string, RegisteredAccount>) => {
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save accounts to localStorage', e);
    }
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Strict real email validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    if (!password) {
      return { success: false, error: 'Password is required to sign in.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const accounts = getRegisteredAccounts();
    const account = accounts[cleanEmail];

    // 2. Avoid fake sign-ins: verify account actually exists
    if (!account) {
      return {
        success: false,
        error: 'No account found with this email. Please click "Create Account" to register first.',
      };
    }

    // 3. Verify password matches registered account
    if (account.passwordHash !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please verify and try again.',
      };
    }

    // Prepare active user session without exposing passwordHash
    const activeUser: User = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      createdAt: account.createdAt,
      savedResumesCount: account.savedResumesCount || 0,
    };

    setUser(activeUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(activeUser));
    closeAuthModal();
    return { success: true };
  };

  const signup = async ({
    name,
    email,
    password,
    role,
  }: {
    name: string;
    email: string;
    password?: string;
    role?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    // 1. Validate full name
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      return { success: false, error: 'Please enter your real full name (at least 2 letters).' };
    }
    if (/^[0-9]+$/.test(trimmedName)) {
      return { success: false, error: 'Full name cannot be just numbers.' };
    }

    // 2. Avoid fake or disposable emails
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    // 3. Avoid fake, trivial, or weak passwords
    const passwordValidation = validatePassword(password || '');
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.error };
    }

    const cleanEmail = email.trim().toLowerCase();
    const accounts = getRegisteredAccounts();

    // 4. Check if email already registered
    if (accounts[cleanEmail]) {
      return {
        success: false,
        error: 'An account with this email already exists. Please choose "Sign In".',
      };
    }

    // 5. Register real account
    const newAccount: RegisteredAccount = {
      id: `user-${Date.now()}`,
      name: trimmedName,
      email: cleanEmail,
      role: role?.trim() || 'Software Professional',
      createdAt: new Date().toISOString(),
      savedResumesCount: 0,
      passwordHash: password!,
    };

    accounts[cleanEmail] = newAccount;
    saveRegisteredAccounts(accounts);

    // Set active user session
    const activeUser: User = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      role: newAccount.role,
      createdAt: newAccount.createdAt,
      savedResumesCount: 0,
    };

    setUser(activeUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(activeUser));
    closeAuthModal();
    return { success: true };
  };

  const loginWithDemo = () => {
    // No-op or disabled to avoid fake accounts
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        loginWithDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
