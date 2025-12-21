
export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="d-flex align-items-center gap-2 my-2">
      <div className="spinner-border spinner-border-sm text-primary" role="status" />
      <span className="text-muted">{label}</span>
    </div>
  );
}
