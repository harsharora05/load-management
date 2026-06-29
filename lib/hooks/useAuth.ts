/**
 * Auth Hook
 * Easy access to auth state
 */

import { useAuth as useAuthContext } from '../context/AuthContext';

export function useAuth() {
    return useAuthContext();
}
