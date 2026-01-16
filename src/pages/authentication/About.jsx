
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

import pp1 from "../../assets/pp1.png";
import pp2 from "../../assets/pp2.png";
import pp3 from "../../assets/pp3.png";
import pp4 from "../../assets/pp4.png";
import ppg from "../../assets/ppg.png";
import ppg1 from "../../assets/ppg1.png";

/* Feature card — light/dark aware */
const FeatureCard = ({ title, children }) => (
  <div
    className="
      bg-bgCard dark:bg-secondary/90
      text-textPrimary dark:text-textInverted
      p-4 rounded-md shadow-sm
      border border-borderDefault dark:border-borderStrong
    "
  >
    <h4 className="font-semibold mb-2">{title}</h4>
    <div className="text-textSecondary dark:text-textInverted/80 text-sm">
      {children}
    </div>
  </div>
);

/* Team member — respects focus and theme text */
const TeamMember = ({ name, role, img }) => (
  <article
    tabIndex={0}
    className="
      text-center p-3 rounded-md
      focus:outline-none focus:ring-2 focus:ring-primary
      text-textPrimary dark:text-textInverted
    "
    aria-label={`${name}${role ? `, ${role}` : ""}`}
  >
    <img
      src={img}
      alt={name}
      className="mx-auto w-20 h-20 rounded-full object-cover mb-2"
      loading="lazy"
    />
    <div className="font-medium">{name}</div>
    <div className="text-textSecondary dark:text-textInverted/70 text-sm">
      {role}
    </div>
  </article>
);

const About = () => {
  return (
    <>
      <Navbar />

      {/* Page container gets theme-aware background and text */}
      <main
        role="main"
        aria-labelledby="about-heading"
        className="max-w-6xl mx-auto p-6 bg-bgBase dark:bg-secondary text-textPrimary dark:text-textInverted"
      >
        {/* HERO */}
        <section className="mb-8 text-center text-primary">
          <h1
            id="about-heading"
            className="text-4xl md:text-5xl font-bold mb-3"
          >
            Building The Insurance Experience You Always Deserved
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-textSecondary dark:text-textInverted/80">
            Our target is to empower people with reliable protection for complete peace of mind and lasting prosperity
          </p>
        </section>

        {/* FEATURES */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <FeatureCard title="Our Mission">
            Make insurance simple, transparent and easy to access for everyday needs.
          </FeatureCard>
          <FeatureCard title="Our Promise">
            Fast claims, clear policy language, and 24/7 support when it matters most.
          </FeatureCard>
          <FeatureCard title="Technology">
            Secure, accessible web UI built for rapid iteration and testing.
          </FeatureCard>
        </section>

        {/* TRUST & IMPACT */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div
              className="
                bg-bgCard dark:bg-secondary/90
                p-4 rounded-md shadow-sm text-center
                border border-borderDefault dark:border-borderStrong
              "
            >
              <div className="text-2xl font-bold">100k+</div>
              <div className="text-textSecondary dark:text-textInverted/70 text-sm">
                Policies issued
              </div>
            </div>

            <div
              className="
                bg-bgCard dark:bg-secondary/90
                p-4 rounded-md shadow-sm text-center
                border border-borderDefault dark:border-borderStrong
              "
            >
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-textSecondary dark:text-textInverted/70 text-sm">
                Claims support availability
              </div>
            </div>

            <div
              className="
                bg-bgCard dark:bg-secondary/90
                p-4 rounded-md shadow-sm text-center
                border border-borderDefault dark:border-borderStrong
              "
            >
              <div className="text-2xl font-bold">98%</div>
              <div className="text-textSecondary dark:text-textInverted/70 text-sm">
                Satisfaction
              </div>
            </div>
          </div>
        </section>

        TEAM
        <section className="mb-8">
          <h3 className="font-semibold mb-4">Meet Our Team</h3>
          <p className="text-textSecondary dark:text-textInverted/80 mb-4">
            A small cross functional group focused on product, design, engineering and operations.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <TeamMember name="Satya" role="" img={pp2} />
            <TeamMember name="Rajendra" role="" img={pp4} />
            <TeamMember name="Iswarya" role="" img={ppg1} />
            <TeamMember name="Anil" role="" img={pp3} />
            <TeamMember name="Kavya" role="" img={ppg} />
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Link
              to="/"
              className="
                px-4 py-2 rounded-md
                bg-primary hover:bg-primaryDark
                text-textInverted shadow-sm
              "
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
