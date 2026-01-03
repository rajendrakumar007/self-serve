
import React from "react";

const RefundPolicy = () => {
  return (
    <main className="px-6 py-10 max-w-4xl mx-auto text-textPrimary">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-4 text-center text-primary">
        Refund Policy
      </h1>
      <p className="text-center text-textMuted mb-10">
        Last updated: <strong>January 1, 2026</strong>
      </p>

      {/* Section 1 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. Overview</h2>
        <p className="leading-relaxed">
          We strive to provide the best service possible. If you are not
          satisfied with your purchase, you may be eligible for a refund under
          the conditions outlined below.
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. Eligibility for Refunds</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Refund requests must be submitted within <strong>7 days</strong> of
            the original purchase date.
          </li>
          <li>The policy or service must not have been fully utilized or claimed.</li>
          <li>No refund will be issued for services already rendered or benefits already availed.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. Non-Refundable Items</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Administrative or processing fees.</li>
          <li>Policies canceled after the coverage period has started.</li>
          <li>Any add-on services or promotional discounts applied at purchase.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Refund Process</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Submit a refund request via our <strong>Customer Support Portal</strong> or email us at{" "}
            <a href="mailto:support@selfserve.com" className="text-primary hover:underline">
              support@selfserve.com
            </a>.
          </li>
          <li>Provide your policy number, purchase details, and reason for cancellation.</li>
          <li>Our team will review your request within <strong>5–7 business days</strong>.</li>
          <li>
            If approved, refunds will be processed to the original payment method within{" "}
            <strong>10 business days</strong>.
          </li>
        </ol>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. Partial Refunds</h2>
        <p className="leading-relaxed">
          In certain cases, partial refunds may be granted if only a portion of the service was used.
          The amount will be calculated based on the unused coverage period and applicable fees.
        </p>
      </section>

      {/* Section 6 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">6. Exceptions</h2>
        <p className="leading-relaxed">
          Refunds may not be available for policies purchased under special offers or discounted rates.
          Please review the terms of your purchase before requesting a refund.
        </p>
      </section>

      {/* Section 7 */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
        <p className="leading-relaxed">
          For any questions regarding this Refund Policy, please contact our support team at{" "}
          <a href="mailto:support@selfserve.com" className="text-primary hover:underline">
            support@selfserve.com
          </a>{" "}
          or call <strong>+1800-123-4567</strong>.
        </p>
      </section>
    </main>
  );
};

export default RefundPolicy;
