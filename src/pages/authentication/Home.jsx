import { useContext } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { ThemeContext } from "../../Context/ThemeContext";
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import car from "../../assets/car.jpg";
import bike from "../../assets/bike.png";
import health from "../../assets/health.jpg";
import life from "../../assets/life.jpg";
import travel from "../../assets/travel.jpg";
import airpass from "../../assets/airpass.jpg";

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const pageBg =
    theme === "dark"
      ? "bg-secondary text-textInverted"
      : "bg-bgBase text-textPrimary";

  // Theme-aware hero gradient container
  const heroGradient =
    theme === "dark"
      ? "bg-gradient-to-b from-[#0a0e27] via-[#12173a] to-[#171b45]"
      : "bg-gradient-to-b from-white via-bgBgLight to-bgBgLight";

  return (
    <div className={`${pageBg} min-h-screen flex flex-col`}>
      <Navbar />

      {/* HERO */}
      <section className="relative">
        <div className="relative overflow-hidden">
          {/* Gradient swaps with theme */}
          <div className={heroGradient}>
            {/* Subtle vignette */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                background:
                  "radial-gradient(1100px 370px at 20% -10%, rgba(255,255,255,0.10), transparent 60%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                background:
                  "radial-gradient(900px 250px at 90% 10%, rgba(99,102,241,0.22), transparent 60%)",
              }}
            />

            {/* Container */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-8">
              {/* Announcement ribbon */}
              <div className="mb-3 flex justify-center">
                <div
                  onClick={() => navigate("/policies/airpass")}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm
                             text-textInverted bg-bgCard/10 dark:bg-secondary/20
                             border border-borderDefault/20 dark:border-borderStrong/30
                             px-3 sm:px-4 py-1.5 rounded-full shadow-sm backdrop-blur cursor-pointer"
                >
                  <span className="inline-block rounded-full bg-primary/80 text-textInverted  px-2 py-0.5 text-[11px] font-semibold">
                    Air Pass
                  </span>
                  <span className="hidden sm:inline dark:text-textInverted/90 text-textPrimary">
                    Flights are chaotic right now. Air Pass is selling out fast.
                  </span>
                  <span className="sm:hidden text-textInverted/90">
                    Selling out fast.
                  </span>
                </div>
              </div>

              {/* Header */}
              <div className="text-center">
                <p className="text-primaryLight font-semibold text-xs sm:text-sm">
                  We are India’s #1 insurance app
                </p>
                <h1 className="font-extrabold text-2xl md:text-4xl tracking-tight mt-1.5 text-textPrimary dark:text-textInverted">
                  Trusted Protection, Honest Prices.
                </h1>
              </div>

              {/* CARD GRID */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <SmallCard
                  title="Car Insurance"
                  desc="Fair prices, Fast claims, That’s our promise."
                  img={car}
                  to="/policies/car"
                  badge="No GST impact"
                />
                <SmallCard
                  title="Bike"
                  desc="Insure in 1 min"
                  img={bike}
                  to="/policies/bike"
                  badge="Quick issue"
                />
                <SmallCard
                  title="Travel"
                  desc="Visa included"
                  img={travel}
                  to="/policies/travel"
                  badge="0% GST"
                />
                <SmallCard
                  title="AirPass"
                  desc="One digital pass for all your insurance needs."
                  img={airpass}
                  to="/policies/airpass"
                  badge="Trending now"
                />
                <SmallCard
                  title="Health"
                  desc="Insurance cover with 100% bill payment"
                  img={health}
                  to="/policies/health"
                  badge="0% GST"
                />
                <SmallCard
                  title="Life"
                  desc="Flexible coverage"
                  img={life}
                  to="/policies/life"
                  badge="0% GST"
                />
              </div>

              {/* STORY SECTION */}
              <div className="mt-10 mb-8 bg-bgCard/95 dark:bg-secondary/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-borderDefault/20 dark:border-borderStrong/30">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-8 dark:textInverted">
                    <h2 className="font-bold text-2xl mb-3 text-textPrimary dark:text-textInverted">
                      Insurance that showed up on time
                    </h2>
                    <p className="text-lg text-textMuted dark:text-textInverted mb-3">
                      When the Mehta family faced an unexpected emergency, their
                      SELFSERVE health policy handled everything approvals,
                      payments, and peace of mind.
                    </p>
                    <p className="text-textMuted dark:text-textInverted mb-5">
                      No calls. No confusion. Just support.
                    </p>

                    <Link
                      to="/story"
                      className="bg-primary text-textInverted px-6 py-2 rounded-md hover:bg-primaryDark transition inline-block shadow-sm"
                    >
                      Read Their Story
                    </Link>
                  </div>

                  <div className="lg:col-span-4 text-center">
                    <div className="text-6xl font-extrabold bg-primaryGradient bg-clip-text text-transparent">
                      24×7
                    </div>
                    <p className="text-textMuted dark:text-textInverted text-lg">
                      Claim support availability
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};


const SmallCard = ({ title, desc, img, to }) => {
  const content = (
    <div
      className="
        relative rounded-lg sm:rounded-xl
        bg-white/90 dark:bg-bgCard/90  backdrop-blur-sm
        border border-white/20 dark:border-borderStrong/30
        overflow-hidden h-full flex flex-col
        cursor-pointer
        transform-gpu transition-transform transition-shadow duration-200
        shadow-xl hover:shadow-xl 
      "
      style={{
        // Helps the browser prep for the animation → smoother lift
        willChange: "transform, box-shadow",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        const arrow = e.currentTarget.querySelector(".arrow");
        if (arrow) {
          arrow.style.color = "#059669";
          arrow.style.transform = "translateX(6px)";
        }
        const glow = e.currentTarget.querySelector(".glow");
        if (glow) glow.style.opacity = 0.22;
        const ring = e.currentTarget.querySelector(".ring");
        if (ring) ring.style.opacity = 0.6;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        const arrow = e.currentTarget.querySelector(".arrow");
        if (arrow) {
          arrow.style.color = "#64748B";
          arrow.style.transform = "translateX(0)";
        }
        const glow = e.currentTarget.querySelector(".glow");
        if (glow) glow.style.opacity = 0;
        const ring = e.currentTarget.querySelector(".ring");
        if (ring) ring.style.opacity = 0.35;
      }}
    >
      {/* gradient ring (subtle) */}
      <div
        className="ring absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-200"
        style={{
          background:
            "linear-gradient(120deg, rgba(99,102,241,0.30), rgba(56,189,248,0.22) 40%, rgba(16,185,129,0.22) 75%)",
          WebkitMask:
            "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
          WebkitMaskComposite: "xor",
          padding: 1.5,
          borderRadius: "12px",
        }}
      />

      {/* subtle glow on hover */}
      <div
        className="glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-200"
        style={{
          background:
            "radial-gradient(700px 260px at 0% 0%, rgba(99,102,241,.14), transparent 60%)",
        }}
      />

      {/* Image */}
      <div className="relative w-full h-[150px] overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-secondary dark:to-secondary/90 rounded-t-lg sm:rounded-t-xl">
        <img
          src={img}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.98) contrast(1.02)" }}
        />
      </div>

      {/* Content — theme aware */}
      <div className="bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted p-3 flex-1 flex">
        <div className="flex justify-between items-start w-full">
          <div className="pr-2">
            <h6 className="font-semibold mb-0.5 leading-snug">{title}</h6>
            <p className="text-[13px] text-textMuted dark:text-textInverted">
              {desc}
            </p>
          </div>
          <FaArrowRight
            className="arrow transition-all duration-200 mt-0.5 shrink-0"
            style={{ color: "#3187ffff" }}
          />
        </div>
      </div>
    </div>
  );

  if (to) return <Link to={to}>{content}</Link>;
  return content;
};

export default Home;
