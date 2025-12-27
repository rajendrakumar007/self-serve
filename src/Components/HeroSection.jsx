import {
  FaCar,
  FaMotorcycle,
  FaHeartbeat,
  FaUserShield,
  FaPlane,
  FaArrowRight,
  FaIdCard
} from "react-icons/fa";

const cards = [
  { title: "Car Insurance", icon: <FaCar /> },
  { title: "Bike & Scooter Insurance", icon: <FaMotorcycle /> },
  { title: "Health Insurance", icon: <FaHeartbeat /> },
  { title: "Life Insurance", icon: <FaUserShield /> },
  { title: "Travel Insurance", icon: <FaPlane /> },
  { title: "Buy New Car", icon: <FaCar /> },
  { title: "Air Pass", icon: <FaIdCard /> }
];

const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto py-12 px-4">
      
      {/* HERO TEXT */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary">
          Insurance that actually works for you
        </h1>
        <p className="text-textMuted text-lg mt-4 max-w-2xl">
          From protecting your family to insuring your next journey, SelfServe
          makes everything simple, fast, and transparent.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-bgCard shadow-sm rounded-lg p-6 h-full transition-transform duration-300 cursor-pointer hover:-translate-y-2"
          >
            <div className="flex justify-between items-start">
              <div className="text-2xl text-primary">{card.icon}</div>
              <FaArrowRight className="text-textSecondary transition-colors duration-300 group-hover:text-primary" />
            </div>

            <h5 className="font-semibold text-textPrimary mt-4">{card.title}</h5>
            <p className="text-textMuted text-sm mt-2">
              Explore plans, compare benefits, and get covered in minutes.
            </p>
          </div>
        ))}
      </div>

      {/* STORY SECTION */}
      <div className="bg-bgCard shadow-lg rounded-lg p-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-textPrimary mb-3">
              A real story. Real protection.
            </h2>
            <p className="text-textMuted text-lg mb-4">
              When the Sharma family faced an unexpected medical emergency,
              their SelfServe health insurance covered the entire treatment
              without a single delay. No paperwork. No stress. Just support
              when it mattered the most.
            </p>
            <p className="text-textMuted mb-6">
              This is why millions trust SelfServe — not just for policies,
              but for peace of mind.
            </p>
            <button className="bg-primary text-textInverted rounded-md px-6 py-2 font-medium hover:bg-primaryDark transition-colors">
              Read More Stories
            </button>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold text-primary">100%</div>
            <p className="text-textMuted text-lg mt-2">
              Cashless support when it mattered most
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
