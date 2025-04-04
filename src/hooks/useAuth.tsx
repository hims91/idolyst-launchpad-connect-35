
// Re-export useAuth from the AuthProvider to maintain backward compatibility
import { useAuth } from '@/providers/AuthProvider';
export { useAuth };

// Add a type declaration to ensure the Role type includes admin
declare module '@/providers/AuthProvider' {
  export interface Role {
    id: string;
    user_id: string;
    role: 'entrepreneur' | 'mentor' | 'admin';  // Updated to include 'admin'
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  }
}
