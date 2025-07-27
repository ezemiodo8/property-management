'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (err) {
      setError(err.message);
    } else {
      router.push('/dashboard');
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
    });
    if (err) {
      setError(err.message);
    } else {
      // After signup, redirect to dashboard
      router.push('/dashboard');
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          {view === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </h2>
        <form onSubmit={view === 'login' ? handleLogin : handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-secondary mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-secondary mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-accent text-white rounded-md hover:bg-red-600 transition"
          >
            {view === 'login' ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>
        <p className="mt-4 text-sm">
          {view === 'login' ? (
            <>
              ¿No tenés cuenta?{' '}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setView('signup');
                  setError('');
                }}
              >
                Registrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tenés cuenta?{' '}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setView('login');
                  setError('');
                }}
              >
                Ingresar
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}