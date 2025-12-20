async function getInvoice(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/invoice/${id}`,
    { cache: 'no-store' },
  );
  if (!res.ok) {
    throw new Error('Failed to load invoice');
  }
  return res.json();
}

export default async function InvoiceDetail({ id }: { id: string }) {
  const invoice = await getInvoice(id);

  return (
    <div className="card">
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>
        Faktúra {invoice.number}
      </h1>

      <p>Email: {invoice.user.email}</p>
      <p>Suma: {invoice.amount} €</p>
      <p>Dátum: {new Date(invoice.createdAt).toLocaleDateString()}</p>

      <a
        href={`${process.env.NEXT_PUBLIC_API_URL}/invoice/download/${invoice.id}`}
        className="button"
        style={{ display: 'inline-block', marginTop: 16 }}
      >
        Stiahnuť PDF
      </a>
    </div>
  );
}

