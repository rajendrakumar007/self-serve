import { useState } from "react";

const FAQQuickActions = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Data preserved exactly as requested
  const faqData = [
    {
      q: "I want to raise a claim",
      a: "Go to Claim in the navbar and click on 'Submit Claim' so that you can raise the claim.",
    },
    {
      q: "I want my policy copy",
      a: "Go to Claim in the navbar and click on 'Track Claims' and enter your policy ID and download the copy of it.",
    },
    {
      q: "How do I renew my policy?",
      a: "Go to 'Premiums section' and select Renewals to renewal your policy.",
    },
    {
      q: "Where can I track my claim?",
      a: "Go to Claim in the navbar and click on 'Track Claims' and enter your policy ID and then you can check the track of your claim.",
    },
    {
      q: "How to track my policy status?",
      a: "Go to Navbar and select 'Check your Policy. An 'Active' status means your coverage is live, while 'Expired' means you need to go to renewals in premium section to renew your policy to avoid a break in coverage.",
    },
    {
      q: "I want to update my details",
      a: "Go to Account and update your details.",
    },
  ];

  const toggleQuestion = (q) => {
    setSelectedQuestion(selectedQuestion === q ? null : q);
  };

  return (
    <div className="max-w-md mx-auto w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </span>
          Frequently Asked Questions
        </h2>
      </div>

      {/* Questions List */}
      <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-700">
        {faqData.map((item, i) => {
          const isOpen = selectedQuestion === item.q;
          
          return (
            <div 
              key={i} 
              className={`group rounded-xl transition-all duration-300 border ${
                isOpen 
                ? "bg-indigo-50/50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-500/20 shadow-sm" 
                : "bg-white dark:bg-zinc-900 border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <button
                onClick={() => toggleQuestion(item.q)}
                className="w-full flex justify-between items-center px-4 py-3.5 text-left"
              >
                <span className={`text-sm font-semibold transition-colors duration-200 ${isOpen ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"}`}>
                  {item.q}
                </span>
                
                {/* Animated Icon */}
                <span className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
                  isOpen 
                    ? "bg-indigo-600 text-white rotate-180" 
                    : "bg-gray-100 dark:bg-zinc-800 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </span>
              </button>

              {/* Answer Section */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0 pb-0"
                }`}
              >
                <div className="overflow-hidden px-4">
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-950/50 p-3 rounded-lg border border-gray-100 dark:border-zinc-800">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQQuickActions;