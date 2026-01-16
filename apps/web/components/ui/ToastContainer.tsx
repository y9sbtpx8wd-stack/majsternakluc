'use client';

export function ToastContainer({ toasts }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 9999,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            padding: '10px 16px',
            borderRadius: 6,
            color: 'white',
            background:
              t.type === 'error'
                ? '#E53935'
                : t.type === 'warning'
                ? '#FB8C00'
                : '#1976D2',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            fontSize: 14,
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
