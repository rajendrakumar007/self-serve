
import React from "react";

const PrivacyPolicy = () => {
  return (
    <main className="px-6 py-10 max-w-4xl mx-auto text-textPrimary">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-4 text-center text-primary">
        Privacy Policy
      </h1>
      <p className="text-center text-textMuted mb-10">
        Last updated: <strong>January 1, 2026</strong>
      </p>

      {/* Section 1 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p className="leading-relaxed">
          We value your privacy. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you use our
          services.
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Personal data</li>
          <li>Usage data</li>
          <li>Device and log information</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide and improve our services</li>
          <li>To communicate with you</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Your Rights</h2>
        <p className="leading-relaxed">
          Depending on your jurisdiction, you may have rights to access,
          correct, delete, or restrict processing of your personal data.
        </p>
      </section>

      {/* Section 5 */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">5. Contact</h2>
        <p className="leading-relaxed">
          For privacy inquiries, contact us at{" "}
          <a
            href="mailto:privacy@example.com"
            className="text-primary hover:underline"
          >
            support@selfserve.com
          </a>.
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
