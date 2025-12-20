export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ maxWidth: 1100, margin: '40px auto' }}>{children}</div>;
}
