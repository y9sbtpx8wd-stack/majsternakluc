async function getInvoices(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/invoice/list${
    params.toString() ? `?${params.toString()}` : ''
  }`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to load invoices');
  }
  return res.json();
}

export default async function InvoiceTable({
  from,
  to,
}: {
  from?: string;
  to?: string;
}) {
  const data = await getInvoices(from, to);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #eee' }}>
          <th style={{ padding: 8, textAlign: 'left' }}>Číslo</th>
          <th style={{ padding: 8, textAlign: 'left' }}>Email</th>
          <th style={{ padding: 8, textAlign: 'left' }}>Suma</th>
          <th style={{ padding: 8, textAlign: 'left' }}>Dátum</th>
          <th style={{ padding: 8, textAlign: 'left' }}>PDF</th>
        </tr>
      </thead>
      <tbody>
        {data.data.map((inv: any) => (
          <tr key={inv.id} style={{ borderBottom: '1px solid #f3f3f3' }}>
            <td style={{ padding: 8 }}>{inv.number}</td>
            <td style={{ padding: 8 }}>{inv.user.email}</td>
            <td style={{ padding: 8 }}>{inv.amount} €</td>
            <td style={{ padding: 8 }}>
              {new Date(inv.createdAt).toLocaleDateString()}
            </td>
            <td style={{ padding: 8 }}>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/invoice/download/${inv.id}`}
                style={{ color: '#6464C7', textDecoration: 'underline' }}
              >
                Stiahnuť
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
