import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { getAuthErrorMessage } from '../utils/authErrors';

export function useAuth() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuthStore();

  const handleSignIn = async (email: string, password: string) => {
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      return true;
    } catch (error) {
      setError(getAuthErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setError('');
    setLoading(true);
    try {
      await signUp(email, password);
      return true;
    } catch (error) {
      setError(getAuthErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
  };
}