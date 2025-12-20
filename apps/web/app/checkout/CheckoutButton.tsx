'use client';

export default function CheckoutButton({
  userId,
  amount,
  period,
}: {
  userId: string;
  amount: number;
  period: 'month' | 'year';
}) {
  const handleCheckout = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, period }),
      },
    );

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Nepodarilo sa vytvoriť checkout session.');
    }
  };

  return (
    <button onClick={handleCheckout} className="button">
      Zaplatiť
    </button>
  );
}
