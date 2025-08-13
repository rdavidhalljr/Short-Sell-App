
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shorting Webapp',
  description: 'Paper-trading short recommendations powered by indicators + online LR',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Shorting Webapp</h1>
            <nav style={{ display: 'flex', gap: 16 }}>
              <a href="/" style={{ textDecoration: 'underline' }}>Dashboard</a>
              <a href="/trades" style={{ textDecoration: 'underline' }}>Trades</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
