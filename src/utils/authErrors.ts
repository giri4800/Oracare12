import { AuthError } from '@supabase/supabase-js';
import { AUTH_ERRORS } from './errorMessages';

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    switch (error.message) {
      case 'Invalid login credentials':
        return AUTH_ERRORS.INVALID_CREDENTIALS;
      case 'User already registered':
        return AUTH_ERRORS.USER_EXISTS;
      default:
        return AUTH_ERRORS.GENERIC_ERROR;
    }
  }
  return AUTH_ERRORS.GENERIC_ERROR;
}