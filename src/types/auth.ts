
export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
}

export interface UserRole {
  id: string;
  role: 'entrepreneur' | 'mentor';
  is_verified: boolean;
}

export interface UserProfile extends AuthUser {
  full_name?: string;
  bio?: string;
  xp: number;
  last_active_tab: string;
  roles: UserRole[];
  created_at: string;
}

export interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, metadata: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  addRole: (role: 'entrepreneur' | 'mentor') => Promise<void>;
  removeRole: (roleId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  full_name?: string;
  roles: ('entrepreneur' | 'mentor')[];
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}
