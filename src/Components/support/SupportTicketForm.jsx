import { useState } from "react";

const SupportTicketForm = ({ onSubmit }) => {
  const [issue, setIssue] = useState("");

  const submitTicket = (e) => {
    e.preventDefault();

    const newTicket = {
      id: Date.now(),
      issue,
      status: "OPEN",
    };

    onSubmit(newTicket);
    setIssue("");
    alert("Support ticket submitted!");
  };

  return (
    <form onSubmit={submitTicket}>
      <textarea
        className="border border-borderDefault rounded w-full p-2 mb-3 bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder-textMuted dark:placeholder-textSecondary"
        placeholder="Describe your issue..."
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        required
      />

      <button className="bg-primary text-textInverted px-4 py-2 rounded hover:bg-primaryDark transition-colors">
        Submit Ticket
      </button>
    </form>
  );
};

export default SupportTicketForm;
