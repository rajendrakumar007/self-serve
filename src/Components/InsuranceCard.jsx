const InsuranceCard = ({ icon, title, desc }) => {
  return (
    <div className="w-full">
      <div className="bg-bgCard shadow-sm rounded-lg h-full">
        <div className="p-6 text-center">
          <div className="text-4xl mb-3 text-primary">{icon}</div>
          <h5 className="font-bold text-textPrimary">{title}</h5>
          <p className="text-textMuted">{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCard;
