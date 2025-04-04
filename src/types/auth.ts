
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string | undefined;
  username?: string;
  avatar_url?: string;
}

export interface UserRole {
  id: string;
  role: 'entrepreneur' | 'mentor';
  is_verified: boolean;
}

export interface ProfessionalExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  isCurrentPosition?: boolean;
  description?: string;
  location?: string;
}

export interface UserQualification {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying?: boolean;
  description?: string;
}

export interface UserProfile extends AuthUser {
  full_name?: string;
  bio?: string;
  xp: number;
  last_active_tab: string;
  roles: UserRole[];
  created_at: string;
  professional_details?: string | null;
  portfolio_url?: string | null;
  byline?: string | null;
  experience?: ProfessionalExperience[];
  qualifications?: UserQualification[];
  preferred_theme?: string;
}

export interface TwoFactorSetupResponse {
  qrCode: string | null;
  secret: string | null;
  error: any;
}

export interface TwoFactorState {
  isEnrolled: boolean;
  isChallengeRequired: boolean;
  currentFactorId?: string;
}

export interface OAuthConnection {
  provider: string;
  last_sign_in: string;
}

export interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  twoFactorState: TwoFactorState;
  oauthConnections: OAuthConnection[];
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, metadata: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: 'google' | 'linkedin_oidc') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  addRole: (role: 'entrepreneur' | 'mentor') => Promise<void>;
  removeRole: (roleId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  setupTwoFactor: () => Promise<TwoFactorSetupResponse>;
  verifyTwoFactorSetup: (factorId: string, code: string) => Promise<{ success: boolean; error: any }>;
  verifyTwoFactorLogin: (factorId: string, code: string) => Promise<{ success: boolean; error: any }>;
  updateThemePreference: (theme: string) => Promise<void>;
  updateByline: (byline: string) => Promise<void>;
  updateExperience: (experience: ProfessionalExperience[]) => Promise<void>;
  updateQualifications: (qualifications: UserQualification[]) => Promise<void>;
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

export interface TwoFactorSetupFormData {
  code: string;
}

export interface TwoFactorVerifyFormData {
  code: string;
}

// Helper function to convert Supabase User to AuthUser
export const mapSupabaseUser = (user: SupabaseUser | null): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || undefined,
    username: user.user_metadata?.username,
    avatar_url: user.user_metadata?.avatar_url,
  };
};
