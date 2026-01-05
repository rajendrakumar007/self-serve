import { useState } from "react";

const TicketList = ({ tickets, onUpdate }) => {
  const [showAll, setShowAll] = useState(false);

  const resolveTicket = (id) => {
    const updated = tickets.map((t) =>
      t.id === id ? { ...t, status: "RESOLVED" } : t
    );

    onUpdate(updated);
  };

  const displayedTickets = showAll ? tickets : tickets.slice(0, 1);

  return (
    <div>
      <h3 className="font-semibold mb-3 text-textPrimary dark:text-textInverted">Your Support Tickets</h3>

      {displayedTickets.map((t) => (
        <div key={t.id} className="border border-borderDefault rounded p-3 mb-2 bg-bgCard dark:bg-secondary">
          <p className="text-textPrimary dark:text-textInverted"><strong>Issue:</strong> {t.issue}</p>

          <p className="mb-2 text-textPrimary dark:text-textInverted">
            <strong>Status:</strong>{" "}
            <span
              className={
                t.status === "OPEN"
                  ? "text-danger font-semibold"
                  : "text-success font-semibold"
              }
            >
              {t.status}
            </span>
          </p>

          {t.status === "OPEN" && (
            <button
              onClick={() => resolveTicket(t.id)}
              className="bg-success text-textInverted px-3 py-1 rounded hover:bg-accent transition-colors"
            >
              Mark Resolved
            </button>
          )}
        </div>
      ))}

      {tickets.length > 1 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 bg-primary text-textInverted px-4 py-2 rounded hover:bg-primaryDark transition-colors"
        >
          {showAll ? "Show Less" : `See All (${tickets.length})`}
        </button>
      )}
    </div>
  );
};

export default TicketList;
