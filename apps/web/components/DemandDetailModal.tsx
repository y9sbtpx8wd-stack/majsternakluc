'use client';

export default function DemandDetailModal({
  demand,
  onClose,
}: {
  demand: any;
  onClose: () => void;
}) {
  if (!demand) return null;

  const openChat = () => {
    localStorage.setItem('chat-demand', JSON.stringify(demand));
    window.dispatchEvent(new Event('open-demand-chat'));
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">
          Dopyt od {demand.firstName} {demand.lastName}
        </h2>

        <div className="modal-section">
          <h3>Obsah dopytu</h3>
          <p>{demand.content}</p>
        </div>

        <div className="modal-section">
          <h3>Lokalita</h3>
          <p>{demand.location}</p>
        </div>

        {demand.price && (
          <div className="modal-section">
            <h3>Ponúkaná cena</h3>
            <p>{demand.price} €</p>
          </div>
        )}

        <div className="modal-section">
          <h3>Kontakt</h3>
          <p><strong>Telefón:</strong> {demand.phone}</p>
          {demand.email && <p><strong>Email:</strong> {demand.email}</p>}
        </div>

        <div className="modal-section">
          <h3>Štatistika</h3>
          <p>Zobrazenia: {demand.views ?? 0}</p>
        </div>

        <button className="button" style={{ marginTop: 20 }} onClick={openChat}>
          Odpovedať na dopyt
        </button>
      </div>
    </div>
  );
}
