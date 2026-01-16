import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Send, Ticket, List, Plus, Clock, Check,
  Search, Filter, RotateCcw, Save, ChevronDown
} from "lucide-react";
import { getCurrentUserId } from "../../utils/auth/auth";
import { useAuth } from "../../context/AuthContext";
import { getTickets, createTicket, reopenTicket } from "../../utils/support/tickets"; 
// 1. Imported notification utilities
import { createNotification } from "../../utils/notifications/notifications";

const SupportTicketForm = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [issue, setIssue] = useState("");
  const [allTickets, setAllTickets] = useState([]);
  
  // Modal & Selection State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [editDescription, setEditDescription] = useState(""); 
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); 

  // Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const navigate = useNavigate();
  const { user: activeUser } = useAuth();
  const effectiveUserId = activeUser?.userId || getCurrentUserId();
  console.log(effectiveUserId)

  // Handle Click Outside Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      setEditDescription(selectedTicket.issueDescription);
      setIsEditing(false);
    }
  }, [selectedTicket]);

  useEffect(() => {
    const loadTickets = async () => {
      if (!effectiveUserId) return;
      try {
        const data = await getTickets(effectiveUserId);
        setAllTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };
    loadTickets();
  }, [effectiveUserId]);

  const confirmReopen = async () => {
    if (!editDescription.trim()) return alert("Please provide a reason or update description.");

    try {
      await reopenTicket(selectedTicket.id, editDescription);

      const updatedTicketData = { 
          ...selectedTicket, 
          status: "OPEN", 
          issueDescription: editDescription
      };

      setAllTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? updatedTicketData : t))
      );
      
      // 2. Add Notification & Trigger Navbar Update for Reopen
      await createNotification({
        userId: effectiveUserId,
        type: "Support",
        message: `Ticket ${selectedTicket.ticketId} has been reopened.`
      });
      window.dispatchEvent(new Event("notificationUpdated"));

      setSelectedTicket(updatedTicketData);
      setIsEditing(false); 
    } catch (err) {
      console.error(err);
    }
  };

  const submitTicket = async (e) => {
    e.preventDefault();
    if (!effectiveUserId) {
      alert("please login to rasie the ticket");
      return navigate("/login");
    }
    
    const nextTicketNumber = allTickets.length + 1;
    const uniqueSuffix = String(nextTicketNumber).padStart(4, "0");
    const ticketId = `TKT-${new Date().getFullYear()}-${uniqueSuffix}`;
    const now = new Date().toISOString();

    // Then convert it to a string with time
    const currentDate = now.toLocaleString();

    const newTicketPayload = {
      ticketId,
      userId: effectiveUserId,
      issueDescription: issue,
      status: "OPEN",
      sentDate: now,
      adminResolution: null,
      updatedDate: now
    };

    try {
      const savedTicket = await createTicket(newTicketPayload);
      setAllTickets((prev) => [...prev, savedTicket]);

      // 3. Add Notification & Trigger Navbar Update for Creation
      await createNotification({
        userId: effectiveUserId,
        type: "Support",
        message: `Ticket ${ticketId} has been successfully raised.`
      });
      window.dispatchEvent(new Event("notificationUpdated"));

      setIssue("");
      setActiveTab("list");
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTickets = useMemo(() => {
    return allTickets
      .filter((t) => t.userId === effectiveUserId)
      .filter((t) => {
        const matchesSearch = t.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => Number(b.id) - Number(a.id));
  }, [allTickets, effectiveUserId, searchQuery, statusFilter]);

  return (
    <div className="w-full space-y-6 relative">
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === "create"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            <Plus size={16} /> Raise Ticket
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === "list"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            <List size={16} /> View History
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 min-h-[400px]">
        {activeTab === "create" && (
          <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
              Describe your issue
            </h3>
            <form onSubmit={submitTicket} className="space-y-4">
              <textarea
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 p-4 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[160px] resize-none"
                placeholder="Please provide details about the problem..."
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <Send size={16} /> Submit Request
              </button>
            </form>
          </div>
        )}

        {activeTab === "list" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              Your Ticket History 
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">{filteredTickets.length}</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by ID (e.g., 8593)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* CUSTOM DROPDOWN */}
              <div ref={filterRef} className="relative min-w-[170px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full flex items-center justify-between pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                >
                  <span className="capitalize font-medium">
                    {statusFilter === "ALL" ? "All Status" : statusFilter.toLowerCase()}
                  </span>
                  <ChevronDown 
                    size={14} 
                    className={`text-gray-500 transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`} 
                  />
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {[
                      { label: "All Status", value: "ALL" },
                      { label: "Open", value: "OPEN" },
                      { label: "Resolved", value: "RESOLVED" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(option.value);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-l-4 ${
                          statusFilter === option.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold"
                            : "border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <Ticket size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || statusFilter !== "ALL" ? "No tickets match your filters." : "No tickets found."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="group bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 px-1.5 rounded">
                           {t.ticketId}
                        </span>
                        <span className="text-xs text-gray-400">{t.sentDate}</span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm font-medium line-clamp-1">
                        {t.issueDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                          t.status === "OPEN"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Ticket size={20} /> 
                {isEditing ? "Reopen Ticket" : "Ticket Details"}
              </h3>
              <button 
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket ID</label>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm text-gray-800 dark:text-gray-200">{selectedTicket.ticketId}</div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${selectedTicket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {selectedTicket.status}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {isEditing ? "Update Description (Required)" : "Issue Description"}
                </label>
                
                {isEditing ? (
                  <textarea
                    className="mt-1 w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Describe why you are reopening this ticket..."
                  />
                ) : (
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700">
                    {selectedTicket.issueDescription}
                  </div>
                )}
              </div>

              {!isEditing && selectedTicket.status === "RESOLVED" && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-green-100 dark:bg-green-800 rounded-full">
                        <Check size={14} className="text-green-600 dark:text-green-300" />
                      </div>
                      <span className="text-sm font-bold text-green-800 dark:text-green-300">
                        Resolution
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 pl-8">
                    {selectedTicket.adminResolution.solution 
                      ? selectedTicket.adminResolution.solution 
                      : "We’re glad we could help! This issue is now marked as resolved."}
                  </p>
                </div>
              )}

              {selectedTicket.status === "OPEN" && !isEditing && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800/30">
                  <Clock size={16} className="mt-0.5" />
                  <div>
                    <span className="font-semibold block">Estimated Resolution</span>
                    Your query will be resolved in 3 business days.
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/30 flex justify-end gap-3">
              {selectedTicket.status === "RESOLVED" && (
                isEditing ? (
                    <>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmReopen}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
                        >
                            <Save size={14} /> Confirm Reopen
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm font-bold transition-colors"
                    >
                        <RotateCcw size={14} /> Edit & Reopen
                    </button>
                )
              )}
              
              {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    Close
                  </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketForm;