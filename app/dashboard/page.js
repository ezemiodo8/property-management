'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

// Dashboard page displays portfolio summary and property cards
export default function DashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      setError('');
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        // Not logged in
        router.push('/login');
        return;
      }
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id);
      if (error) {
        setError(error.message);
        setProperties([]);
      } else {
        setProperties(data || []);
      }
      setLoading(false);
    }
    fetchProperties();
  }, [router]);

  // Compute summary metrics
  const totalNetWorth = properties.reduce((sum, p) => sum + (p.net_worth || 0), 0);
  const totalRent = properties.reduce((sum, p) => sum + (p.rent || 0), 0);
  const roiValues = properties
    .filter((p) => p.net_worth && p.net_worth > 0 && p.rent)
    .map((p) => ((p.rent * 12) / p.net_worth) * 100);
  const avgRoi = roiValues.length
    ? roiValues.reduce((a, b) => a + b, 0) / roiValues.length
    : null;

  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {/* Summary cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="text-secondary text-sm">Patrimonio total</span>
          <span className="text-xl font-bold">
            {totalNetWorth > 0
              ? totalNetWorth.toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  maximumFractionDigits: 0,
                })
              : '–'}
          </span>
        </div>
        <div className="stat-card">
          <span className="text-secondary text-sm">Alquiler mensual total</span>
          <span className="text-xl font-bold">
            {totalRent > 0
              ? totalRent.toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  maximumFractionDigits: 0,
                })
              : '–'}
          </span>
        </div>
        <div className="stat-card">
          <span className="text-secondary text-sm">ROI promedio</span>
          <span className="text-xl font-bold">
            {avgRoi !== null ? `${avgRoi.toFixed(1)}%` : '–'}
          </span>
        </div>
      </div>

      {/* Property cards */}
      {loading ? (
        <p>Cargando...</p>
      ) : properties.length === 0 ? (
        <p>No tenés propiedades aún. Utilizá el botón de alta para crear una.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <div
              key={p.id}
              className="property-card"
              onClick={() => router.push(`/properties/${p.id}`)}
            >
              {/* Show first picture or placeholder */}
              {p.pictures && p.pictures.length > 0 ? (
                // Assumes pictures are stored as URLs in Supabase Storage
                <img src={p.pictures[0]} alt={p.name} />
              ) : (
                <div className="bg-gray-200 h-40 flex items-center justify-center">
                  <span className="text-secondary">Sin imagen</span>
                </div>
              )}
              <div className="property-card-body">
                <span className="font-semibold">{p.name}</span>
                <span className="text-sm text-secondary">
                  {p.location || p.address || ''}
                </span>
                <span className="text-sm text-primary">
                  {p.rent
                    ? `${p.rent.toLocaleString('es-AR', {
                        style: 'currency',
                        currency: p.currency || 'ARS',
                        maximumFractionDigits: 0,
                      })}/mes`
                    : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link to create new property */}
      <div className="mt-8 text-right">
        <a
          href="/properties/new"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
        >
          + Nueva propiedad
        </a>
      </div>
    </main>
  );
}
