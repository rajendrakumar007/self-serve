
import React from "react";

const TermsOfService = () => {
  return (
    <main className="px-6 py-10 max-w-4xl mx-auto text-textPrimary">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-4 text-center text-primary">
        Terms of Service
      </h1>
      <p className="text-center text-textMuted mb-10">
        Effective date: <strong>January 1, 2026</strong>
      </p>

      {/* Section 1 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="leading-relaxed">
          By accessing or using our services, you agree to be bound by these Terms.
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. Use of the Service</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You must be legally capable of entering into a contract.</li>
          <li>You agree not to misuse the service or interfere with its operation.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. Intellectual Property</h2>
        <p className="leading-relaxed">
          All content, trademarks, and data on the service are owned by or licensed to us.
        </p>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Limitation of Liability</h2>
        <p className="leading-relaxed">
          We are not liable for indirect or consequential damages. Use the service at your own risk.
        </p>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. Changes to Terms</h2>
        <p className="leading-relaxed">
          We may modify these Terms at any time. Continued use constitutes acceptance of the changes.
        </p>
      </section>

      {/* Section 6 */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">6. Contact</h2>
        <p className="leading-relaxed">
          For questions about these Terms, contact us at{" "}
          <a
            href="mailto:legal@example.com"
            className="text-primary hover:underline"
          >
            support@selfserve.com
          </a>.
        </p>
      </section>
    </main>
  );
};

export default TermsOfService;
