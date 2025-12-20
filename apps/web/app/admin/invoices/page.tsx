import InvoiceFilters from './InvoiceFilters';
import InvoiceTable from './InvoiceTable';

export default function InvoicesPage({
  searchParams,
}: {
  searchParams?: { from?: string; to?: string };
}) {
  const from = searchParams?.from;
  const to = searchParams?.to;

  return (
    <div className="card">
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Faktúry</h1>
      <InvoiceFilters />
      <InvoiceTable from={from} to={to} />
    </div>
  );
}
