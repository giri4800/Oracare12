// Define consistent error messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'An account with this email already exists. Please sign in instead.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  WEAK_PASSWORD: 'Password must be at least 6 characters long',
} as const;