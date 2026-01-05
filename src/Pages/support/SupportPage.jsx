import { useState } from "react";
import ChatBox from "../../Components/support/ChatBox";
import FAQQuickActions from "../../Components/support/FAQQuikActions";
import SupportTicketForm from "../../Components/support/SupportTicketForm";
import TicketList from "../../Components/support/TicketList";
import Navbar from "../../Components/Navbar";
import { getTickets, saveTickets } from "../../data/support/tickets.js";

const SupportPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [tickets, setTickets] = useState(getTickets());

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setIsChatOpen(true);
  };

  const addTicket = (newTicket) => {
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    saveTickets(updated);
  };

  const updateTickets = (updatedTickets) => {
    setTickets(updatedTickets);
    saveTickets(updatedTickets);
  };

  return (
    <>
    
    <Navbar/>
    <div className="min-h-screen bg-bgBase dark:bg-secondary p-8 relative">
      <h1 className="text-2xl font-bold mb-6 text-center text-textPrimary dark:text-textInverted">Customer Support</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left: Quick Help */}
        <div className="bg-bgCard dark:bg-secondary shadow-xl rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-center text-textPrimary dark:text-textInverted">Quick Questions</h2>
          <FAQQuickActions
            onSelect={handleQuestionSelect}
          />
        </div>

        {/* Right: Support Tickets */}
        <div className="bg-bgCard dark:bg-secondary shadow-xl rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-3 text-center text-textPrimary dark:text-textInverted">Support Tickets</h2>

          {/* Raise Ticket Section */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-2 text-textPrimary dark:text-textInverted">Raise New Ticket</h3>
            <SupportTicketForm onSubmit={addTicket} />
          </div>

          {/* Ticket List Section */}
          <div>
            <TicketList tickets={tickets} onUpdate={updateTickets} />
          </div>
        </div>

      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-textInverted px-4 py-2 rounded-full shadow-lg hover:bg-primaryDark transition-colors flex items-center gap-2"
        title="Chat with Us"
      >
        💬 Chat with Us
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bgCard dark:bg-secondary rounded-2xl p-6 w-full max-w-md mx-4 relative">
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-2 right-2 text-textMuted dark:text-textSecondary hover:text-textPrimary dark:hover:text-textInverted"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4 text-textPrimary dark:text-textInverted">Chat with Support</h3>
            <ChatBox initialMessage={selectedQuestion} />
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default SupportPage;
