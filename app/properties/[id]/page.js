'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';

// Detail and edit page for a single property
export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [property, setProperty] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data: prop, error: propErr } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single();
      if (propErr) {
        setError(propErr.message);
      } else {
        setProperty(prop);
        // Fetch payments
        const { data: pay, error: payErr } = await supabase
          .from('payments')
          .select('*')
          .eq('property_id', id)
          .order('date', { ascending: false });
        if (!payErr) setPayments(pay || []);
      }
      setLoading(false);
    }
    if (id) fetchData();
  }, [id, router]);

  async function handleAddPayment(e) {
    e.preventDefault();
    setError('');
    const amountNum = parseFloat(paymentAmount);
    const dateStr = paymentDate || new Date().toISOString().split('T')[0];
    const { error: payErr } = await supabase.from('payments').insert([
      {
        property_id: id,
        amount: amountNum,
        date: dateStr,
      },
    ]);
    if (payErr) {
      setError(payErr.message);
    } else {
      setPaymentAmount('');
      setPaymentDate('');
      // Reload payments
      const { data: pay } = await supabase
        .from('payments')
        .select('*')
        .eq('property_id', id)
        .order('date', { ascending: false });
      setPayments(pay || []);
    }
  }

  if (loading) {
    return <p className="p-4">Cargando...</p>;
  }
  if (!property) {
    return <p className="p-4 text-red-500">{error || 'Propiedad no encontrada'}</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{property.name}</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-blue-600 hover:underline"
        >
          ← Volver
        </button>
      </div>
      {/* Property info */}
      <div className="bg-white shadow rounded-lg p-4 space-y-2">
        <div>
          <span className="font-semibold">Dirección:</span> {property.address}
        </div>
        {property.location && (
          <div>
            <span className="font-semibold">Ubicación:</span> {property.location}
          </div>
        )}
        {property.net_worth && (
          <div>
            <span className="font-semibold">Valor estimado:</span>{' '}
            {property.net_worth.toLocaleString('es-AR', {
              style: 'currency',
              currency: property.currency || 'ARS',
              maximumFractionDigits: 0,
            })}
          </div>
        )}
        {property.rent && (
          <div>
            <span className="font-semibold">Alquiler:</span>{' '}
            {property.rent.toLocaleString('es-AR', {
              style: 'currency',
              currency: property.currency || 'ARS',
              maximumFractionDigits: 0,
            })}
            /mes
          </div>
        )}
        {property.description && (
          <div>
            <span className="font-semibold">Descripción:</span> {property.description}
          </div>
        )}
      </div>
      {/* Payments */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Pagos</h2>
        {payments.length === 0 ? (
          <p>No hay pagos registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-1">Fecha</th>
                <th className="text-left py-1">Monto</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-1">
                    {new Date(p.date).toLocaleDateString('es-AR')}
                  </td>
                  <td className="py-1">
                    {p.amount.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: property.currency || 'ARS',
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Add payment form */}
        <form onSubmit={handleAddPayment} className="mt-4 space-x-2 flex">
          <input
            type="number"
            placeholder="Monto"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="border border-gray-300 p-2 rounded-md flex-1"
            required
          />
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Agregar
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </main>
  );
}