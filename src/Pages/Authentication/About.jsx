
import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaCheckCircle, FaQuestionCircle, FaHandsHelping } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const About = () => {
  return (
    <div className="min-h-screen bg-secondary bg-gradient-to-br from-secondary to-primaryDark text-textInverted flex justify-center items-start p-4">
      <div className="w-full max-w-4xl bg-bgCard/95 backdrop-blur-sm rounded-card shadow-lg border border-borderDefault p-6 sm:p-8 text-textPrimary">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <FaShieldAlt className="text-primary text-2xl" />
          <h1 className="text-2xl sm:text-3xl font-bold">About SelfServe</h1>
        </div>
        <p className="text-textSecondary mb-6">
          SelfServe is a simple, unified web experience for managing insurance policies,
          initiating and tracking claims, and accessing helpful resources — all in one place.
          Designed for speed, clarity, and accessibility, it brings the essentials to your
          fingertips with a modern, consistent UI.
        </p>

        {/* What you can do */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">What you can do here</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            <li className="flex items-start gap-2 p-3 rounded-md border border-borderDefault bg-bgMuted">
              <FaCheckCircle className="text-success mt-1" />
              <div>
                <p className="font-medium">Explore Policies</p>
                <p className="text-textSecondary text-sm">
                  Health, Motor, and Term Insurance options with clear benefits and quotes.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-md border border-borderDefault bg-bgMuted">
              <FaCheckCircle className="text-success mt-1" />
              <div>
                <p className="font-medium">Submit & Track Claims</p>
                <p className="text-textSecondary text-sm">
                  Start a claim, track progress, and view past claim history.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-md border border-borderDefault bg-bgMuted">
              <FaCheckCircle className="text-success mt-1" />
              <div>
                <p className="font-medium">Get Help & FAQs</p>
                <p className="text-textSecondary text-sm">
                  Browse guides, FAQs, and blogs to learn and troubleshoot quickly.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-md border border-borderDefault bg-bgMuted">
              <FaCheckCircle className="text-success mt-1" />
              <div>
                <p className="font-medium">Manage Your Profile</p>
                <p className="text-textSecondary text-sm">
                  Update personal details, avatar, and account preferences with ease.
                </p>
              </div>
            </li>
          </ul>
        </section>

        {/* Policies summary */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Policy Categories</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-md border border-borderDefault p-4 bg-bgMuted">
              <p className="font-semibold mb-1">Health Insurance</p>
              <p className="text-textSecondary text-sm mb-3">
                Cashless treatment, fast claims, wide hospital networks.
              </p>
              <Link
                to="/policies/health/overview"
                className="inline-flex items-center gap-2 text-primary hover:text-primaryDark"
              >
                Explore <IoIosArrowForward />
              </Link>
            </div>
            <div className="rounded-md border border-borderDefault p-4 bg-bgMuted">
              <p className="font-semibold mb-1">Motor Insurance</p>
              <p className="text-textSecondary text-sm mb-3">
                Accident coverage, easy renewals, zero depreciation options.
              </p>
              <Link
                to="/policies/motor/overview"
                className="inline-flex items-center gap-2 text-primary hover:text-primaryDark"
              >
                Explore <IoIosArrowForward />
              </Link>
            </div>
            <div className="rounded-md border border-borderDefault p-4 bg-bgMuted">
              <p className="font-semibold mb-1">Term Insurance</p>
              <p className="text-textSecondary text-sm mb-3">
                High cover, low premiums, riders for comprehensive protection.
              </p>
              <Link
                to="/policies/term/overview"
                className="inline-flex items-center gap-2 text-primary hover:text-primaryDark"
              >
                Explore <IoIosArrowForward />
              </Link>
            </div>
          </div>
        </section>

        {/* Claims overview */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Claims at a glance</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link
              to="/claims/submit"
              className="block rounded-md border border-borderDefault p-4 bg-bgMuted hover:bg-bgHover transition"
            >
              <p className="font-semibold mb-1">Submit Claim</p>
              <p className="text-textSecondary text-sm">Start a new claim request.</p>
            </Link>
            <Link
              to="/claims/track"
              className="block rounded-md border border-borderDefault p-4 bg-bgMuted hover:bg-bgHover transition"
            >
              <p className="font-semibold mb-1">Track Claim</p>
              <p className="text-textSecondary text-sm">Monitor status and updates.</p>
            </Link>
            <Link
              to="/claims/history"
              className="block rounded-md border border-borderDefault p-4 bg-bgMuted hover:bg-bgHover transition"
            >
              <p className="font-semibold mb-1">Claim History</p>
              <p className="text-textSecondary text-sm">View previous claim activity.</p>
            </Link>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Resources</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link
              to="/resources/guides"
              className="block rounded-md border border-borderDefault p-4 bg-bgMuted hover:bg-bgHover transition"
            >
              <p className="font-semibold mb-1">Policy Guides</p>
              <p className="text-textSecondary text-sm">Understand features and terms.</p>
            </Link>
            <Link
              to="/resources/faqs"
              className="block rounded-md border border-borderDefault p-4 bg-bgMuted hover:bg-bgHover transition"
            >
              <p className="font-semibold mb-1">FAQs</p>
              <p className="text-textSecondary text-sm">Get quick answers to common questions.</p>
            </Link>
            <Link
              to="/resources/blogs"
              className="block rounded-md border border-borderDefault p-4 bg-bgMuted hover:bg-bgHover transition"
            >
              <p className="font-semibold mb-1">Blogs</p>
              <p className="text-textSecondary text-sm">Stay updated with insights and tips.</p>
            </Link>
          </div>
        </section>

        {/* Help / Contact */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FaHandsHelping className="text-primary" />
            Need help?
          </h2>
          <p className="text-textSecondary mb-3">
            Visit our Support page for guidance, or contact us for assistance with policies or claims.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/support"
              className="inline-flex items-center gap-2 bg-primary text-textInverted px-4 py-2 rounded-md hover:bg-primaryDark"
            >
              <FaQuestionCircle /> Go to Support
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-md hover:bg-primaryLight/10"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-primary text-textInverted px-4 py-2 rounded-md hover:bg-primaryDark"
            >
              Register
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
