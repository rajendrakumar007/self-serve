const questions = [
  "I want to raise a claim",
  "I want my policy copy",
  "How do I renew my policy?",
  "Where can I track my claim?",
  "I want to update my details",
  "Something else"
];

const FAQQuickActions = ({ onSelect }) => {
  return (
    <div className="space-y-2">
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          className="w-full flex justify-between items-center border rounded px-4 py-2 hover:bg-gray-100"
        >
          <span>{q}</span>
          <span className="text-gray-600 font-semibold">→</span>
        </button>
      ))}
    </div>
  );
};

export default FAQQuickActions;
