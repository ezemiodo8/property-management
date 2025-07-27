import '../styles/globals.css';

export const metadata = {
  title: 'Propiedades AR',
  description: 'Gestión moderna de inversiones inmobiliarias en Argentina',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-background text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}