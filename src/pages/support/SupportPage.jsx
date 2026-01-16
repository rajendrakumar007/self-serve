import { useState } from "react";
import { MessageCircle, X, Ticket, Zap } from "lucide-react"; // Import Icons
import ChatBox from "../../components/support/ChatBox.jsx";
import FAQQuickActions from "../../components/support/FAQQuikActions.jsx";
import SupportTicketForm from "../../components/support/SupportTicketForm.jsx";
import Navbar from "../../components/common/Navbar.jsx";
import { getTickets } from "../../utils/support/tickets.js";

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
  };

  const updateTickets = (updatedTickets) => {
    setTickets(updatedTickets);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bgBase dark:bg-secondary p-8 relative">
        <h1 className="text-2xl font-bold mb-6 text-center text-textPrimary dark:text-textInverted">
          Customer Support
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Support Tickets */}
          <div className="lg:col-span-2 bg-bgCard dark:bg-secondary shadow-xl rounded-2xl p-6">
            <div className="flex items-center justify-center gap-2 mb-6 text-textPrimary dark:text-textInverted">
              <Ticket className="w-6 h-6" />
              <h1 className="text-xl font-bold">Support Tickets</h1>
            </div>

            <div className="mb-6">
              <SupportTicketForm onSubmit={addTicket} />
            </div>
          </div>

          {/* Right: Quick Help */}
          <div className="bg-bgCard dark:bg-secondary shadow-xl rounded-2xl p-6 h-fit">
            <div className="flex items-center justify-center gap-2 mb-4 text-textPrimary dark:text-textInverted">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Quick Help</h2>
            </div>
            <FAQQuickActions onSelect={handleQuestionSelect} />
          </div>

        </div>

        {/* Floating Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-textInverted px-4 py-3 rounded-full shadow-lg hover:bg-primaryDark transition-all flex items-center gap-2 hover:scale-105"
          title="Chat with Us"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Chat with Us</span>
        </button>

        {/* Chat Modal */}
        {isChatOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-bgCard dark:bg-secondary rounded-2xl p-6 w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsChatOpen(false)}
                className="absolute top-4 right-4 text-textMuted dark:text-textSecondary hover:text-textPrimary dark:hover:text-textInverted transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h3 className="text-lg font-semibold mb-4 text-textPrimary dark:text-textInverted flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat with Support
              </h3>
              
              <ChatBox initialMessage={selectedQuestion} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SupportPage;