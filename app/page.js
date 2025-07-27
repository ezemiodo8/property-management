export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-6">Propiedades&nbsp;AR</h1>
      <p className="mb-4 text-secondary">Gestioná tu patrimonio inmobiliario de forma moderna</p>
      <a
        href="/login"
        className="px-6 py-3 bg-accent text-white rounded-md shadow hover:bg-red-600 transition"
      >
        Ingresar
      </a>
    </main>
  );
}