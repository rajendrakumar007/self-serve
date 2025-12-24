import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { FaArrowRight } from "react-icons/fa";

import car from "../../assets/car.jpg";
import bike from "../../assets/bike.jpg";
import health from "../../assets/health.jpg";
import life from "../../assets/life.jpg";
import travel from "../../assets/travel.jpg";
import newcar from "../../assets/newcar.jpg";
import airpass from "../../assets/airpass.jpg";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="py-12 bg-primaryGradient text-textInverted">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="font-bold text-4xl md:text-5xl mb-3">
            Insurance, built for everyday life
          </h1>
          <p className="text-lg opacity-75 max-w-2xl mb-10">
            Simple plans. Instant claims. Zero paperwork. Everything you need,
            right when you need it.
          </p>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-10">
            <div className="lg:col-span-5">
              <SmallCard
                title="Car Insurance"
                desc="Protect your car with instant claims and zero hassle."
                img={car}
              />
            </div>

            <div className="lg:col-span-3 md:col-span-6">
              <SmallCard
                title="Bike & Scooter"
                desc="Affordable coverage for daily rides."
                img={bike}
              />
            </div>

            <div className="lg:col-span-4 md:col-span-6">
              <SmallCard
                title="Health Insurance"
                desc="Cashless treatment when it matters most."
                img={health}
              />
            </div>

            <div className="lg:col-span-3 md:col-span-6">
              <SmallCard
                title="Life Insurance"
                desc="Secure your family’s future, stress-free."
                img={life}
              />
            </div>

            <div className="lg:col-span-3 md:col-span-6">
              <SmallCard
                title="Travel Insurance"
                desc="Travel smart with global protection."
                img={travel}
              />
            </div>

            <div className="lg:col-span-3 md:col-span-6">
              <SmallCard
                title="Buy New Car"
                desc="Find, finance, and insure your car in one place."
                img={newcar}
              />
            </div>

            <div className="lg:col-span-3 md:col-span-6">
              <SmallCard
                title="Sir Pass"
                desc="One digital pass for all your insurance needs."
                img={airpass}
              />
            </div>
          </div>

          {/* STORY SECTION */}
          <div className="bg-bgCard shadow-lg rounded-xl p-8 text-textPrimary">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8">
                <h2 className="font-bold text-2xl mb-3">
                  Insurance that showed up on time
                </h2>
                <p className="text-lg text-textSecondary mb-3">
                  When the Mehta family faced an unexpected emergency, their
                  SelfServe health policy handled everything — approvals,
                  payments, and peace of mind.
                </p>
                <p className="text-textSecondary mb-5">
                  No calls. No confusion. Just support.
                </p>
                <button className="bg-primary text-textInverted px-6 py-2 rounded-md hover:bg-primaryDark transition">
                  Read Their Story
                </button>
              </div>

              <div className="lg:col-span-4 text-center">
                <div className="text-6xl font-bold text-primary">24×7</div>
                <p className="text-textSecondary text-lg">
                  Claim support availability
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

/* SMALL CARD COMPONENT */
const SmallCard = ({ title, desc, img }) => {
  return (
    <div
      className="bg-bgCard shadow-sm rounded-lg overflow-hidden h-full transform transition duration-200 cursor-pointer"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        const arrow = e.currentTarget.querySelector(".arrow");
        arrow.style.color = "#2563eb"; // primary
        arrow.style.transform = "translateX(6px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        const arrow = e.currentTarget.querySelector(".arrow");
        arrow.style.color = "#64748B"; // textMuted
        arrow.style.transform = "translateX(0)";
      }}
    >
      <img
        src={img}
        alt={title}
        className="w-full h-[170px] object-cover"
      />

      <div className="bg-secondary/70 text-textInverted p-4">
        <div className="flex justify-between items-center">
          <div>
            <h6 className="font-semibold mb-1">{title}</h6>
            <p className="text-sm opacity-75">{desc}</p>
          </div>
          <FaArrowRight
            className="arrow transition-all duration-200"
            style={{ color: "#64748B" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
