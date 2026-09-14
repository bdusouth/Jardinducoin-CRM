import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jardin du Coin - CRM & Services Paysagers Rive-Sud',
  description:
    'Système de gestion et CRM professionnel pour services paysagers sur la Rive-Sud de Montréal (Longueuil, Brossard, Boucherville, Saint-Lambert, Candiac, etc.). Devis, facturation, mode terrain et planification de routes.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-100 dark:bg-slate-950 font-sans">
        {children}
      </body>
    </html>
  );
}
