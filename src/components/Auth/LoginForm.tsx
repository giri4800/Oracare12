import React, { useState } from 'react';
import { FormInput } from './FormInput';
import { useAuth } from '../../hooks/useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, loading, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
        disabled={loading}
      />
      <FormInput
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        required
        minLength={6}
        disabled={loading}
      />
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}