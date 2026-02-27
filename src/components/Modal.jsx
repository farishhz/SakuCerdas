export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" onClick={(event) => event.stopPropagation()}>
        <div className="between">
          <h3>{title}</h3>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
