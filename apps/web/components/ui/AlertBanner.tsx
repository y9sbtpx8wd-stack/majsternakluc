'use client';

export function AlertBanner({ alerts }) {
  if (alerts.length === 0) return null;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '10px 16px',
        background: '#E53935',
        color: 'white',
        fontWeight: 600,
        borderBottom: '2px solid rgba(0,0,0,0.2)',
      }}
    >
      {alerts.map((a, i) => (
        <div key={i}>{a}</div>
      ))}
    </div>
  );
}
