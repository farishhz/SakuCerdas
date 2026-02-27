export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast" role="status">
      <span>{message}</span>
      <button className="btn-ghost" onClick={onClose}>Close</button>
    </div>
  );
}
