const StatusBadge = ({ status }) => {
  const styles = {
    SUCCESS: "bg-successBg text-success",
    PENDING: "bg-warningBg text-warning",
    FAILED: "bg-dangerBg text-danger",
  };

  return (
    <span className={`px-3 py-1 rounded-pill text-sm ${styles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
