'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

// Page to create a new property. This is a simplified form; adjust as needed.
export default function NewPropertyPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [netWorth, setNetWorth] = useState('');
  const [rent, setRent] = useState('');
  const [currency, setCurrency] = useState('ARS');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Get current user
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      router.push('/login');
      return;
    }
    const { data, error: insertErr } = await supabase
      .from('properties')
      .insert([
        {
          owner_id: user.id,
          name,
          address,
          location,
          net_worth: netWorth ? parseFloat(netWorth) : null,
          rent: rent ? parseFloat(rent) : null,
          currency,
          description,
        },
      ])
      .select()
      .single();
    if (insertErr) {
      setError(insertErr.message);
    } else {
      router.push(`/properties/${data.id}`);
    }
    setLoading(false);
  }

  return (
    <main className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Nueva propiedad</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-secondary mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-secondary mb-1">Dirección</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-secondary mb-1">Barrio / Localidad</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-secondary mb-1">Valor estimado</label>
          <input
            type="number"
            value={netWorth}
            onChange={(e) => setNetWorth(e.target.value)}
            step="any"
            min="0"
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-secondary mb-1">Alquiler mensual</label>
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            min="0"
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-secondary mb-1">Moneda</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-secondary mb-1">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Guardando…' : 'Guardar'}
        </button>
      </form>
    </main>
  );
}