import './global.css';

export const metadata = {
  title: 'Majster na kľúč',
  description: 'Inzeráty, faktúry a platby pre Majster na kľúč',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body>
        <header className="header">
          <div style={{ fontWeight: 600 }}>Majster na kľúč – Admin</div>
          <nav style={{ display: 'flex', gap: 12 }}>
            <a href="/admin/ads">Inzeráty</a>
            <a href="/admin/invoices">Faktúry</a>
          </nav>
        </header>
        <main style={{ padding: 20 }}>{children}</main>
      </body>
    </html>
  );
}
