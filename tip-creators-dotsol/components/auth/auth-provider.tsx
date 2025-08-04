import { createContext, type PropsWithChildren, use, useMemo } from 'react'
import { useMobileWallet } from '@/components/solana/use-mobile-wallet'
import { AppConfig } from '@/constants/app-config'
import { Account, useAuthorization } from '@/components/solana/use-authorization'
import { useMutation } from '@tanstack/react-query'

export type UserRole = 'creator' | 'tipper' | 'both' | null;

export interface UserProfile {
  id: string;
  walletAddress: string;
  name: string;
  handle?: string;
  bio?: string;
  avatar?: string;
  role: UserRole;
  isCreator: boolean;
  isTipper: boolean;
  createdAt: string;
  lastActive: string;
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  userProfile: UserProfile | null
  signIn: () => Promise<Account>
  signOut: () => Promise<void>
  setUserRole: (role: UserRole) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const Context = createContext<AuthState>({} as AuthState)

export function useAuth() {
  const value = use(Context)
  if (!value) {
    throw new Error('useAuth must be wrapped in a <AuthProvider />')
  }

  return value
}

function useSignInMutation() {
  const { signIn } = useMobileWallet()

  return useMutation({
    mutationFn: async () =>
      await signIn({
        uri: AppConfig.uri,
      }),
  })
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { disconnect } = useMobileWallet()
  const { accounts, isLoading } = useAuthorization()
  const signInMutation = useSignInMutation()

  // TODO: Replace with real API calls
  const setUserRole = async (role: UserRole) => {
    // This would call the backend to set user role
    console.log('Setting user role:', role);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    // This would call the backend to update profile
    console.log('Updating profile:', updates);
  };

  const value: AuthState = useMemo(
    () => ({
      signIn: async () => await signInMutation.mutateAsync(),
      signOut: async () => await disconnect(),
      isAuthenticated: (accounts?.length ?? 0) > 0,
      isLoading: signInMutation.isPending || isLoading,
      userProfile: null, // TODO: Get from backend
      setUserRole,
      updateProfile,
    }),
    [accounts, disconnect, signInMutation, isLoading],
  )

  return <Context value={value}>{children}</Context>
}
