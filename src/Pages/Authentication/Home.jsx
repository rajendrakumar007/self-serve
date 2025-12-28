
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import car from "../../assets/imgs/car.jpg";
import bike from "../../assets/imgs/bike.jpg";
import health from "../../assets/imgs/health.jpg";
import life from "../../assets/imgs/life.jpg";
import travel from "../../assets/imgs/travel.jpg";
import airpass from "../../assets/imgs/airpass.jpg";

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

          {/* CARDS – 6 items, same size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <SmallCard
              title="Car Insurance"
              desc="Protect your car with instant claims and zero hassle."
              img={car}
              to="/policies/car"
            />

            <SmallCard
              title="Bike & Scooter"
              desc="Affordable coverage for daily rides."
              img={bike}
              to="/policies/bike"
            />

            <SmallCard
              title="Health Insurance"
              desc="Cashless treatment when it matters most."
              img={health}
              to="/policies/health"
            />

            <SmallCard
              title="Life Insurance"
              desc="Secure your family’s future, stress-free."
              img={life}
              to="/policies/life"
            />

            <SmallCard
              title="Travel Insurance"
              desc="Travel smart with global protection."
              img={travel}
              to="/policies/travel"
            />

            <SmallCard
              title="Air Pass"
              desc="One digital pass for all your insurance needs."
              img={airpass}
              to="/policies/airpass"
            />
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
                  SelfServe health policy handled everything approvals,
                  payments, and peace of mind.
                </p>
                <p className="text-textSecondary mb-5">
                  No calls. No confusion. Just support.
                </p>

                <Link
                  to="/story"
                  className="bg-primary text-textInverted px-6 py-2 rounded-md hover:bg-primaryDark transition inline-block"
                >
                  Read Their Story
                </Link>

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
const SmallCard = ({ title, desc, img, to }) => {
  const content = (
    <div
      className="bg-bgCard shadow-sm rounded-lg overflow-hidden h-full flex flex-col transform transition duration-200 cursor-pointer"
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
      <img src={img} alt={title} className="w-full h-[170px] object-cover" />

      {/* Make the content stretch to equalize card height */}
      <div className="bg-secondary/70 text-textInverted p-4 flex-1 flex">
        <div className="flex justify-between items-start w-full">
          <div className="pr-3">
            <h6 className="font-semibold mb-1">{title}</h6>
            <p className="text-sm opacity-75">{desc}</p>
          </div>
          <FaArrowRight
            className="arrow transition-all duration-200 mt-1 shrink-0"
            style={{ color: "#64748B" }}
          />
        </div>
      </div>
    </div>
  );

  if (to) return <Link to={to}>{content}</Link>;

  return content;
};

export default Home;
``
