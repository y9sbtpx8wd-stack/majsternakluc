export default function AdModal({ ad, onClose }) {
  if (!ad) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>X</button>
        <h2>{ad.title}</h2>
        <img src={ad.imageUrl} alt={ad.title} />
        <p>{ad.description}</p>
        <p>Cena: {ad.price} €</p>
      </div>
    </div>
  );
}
