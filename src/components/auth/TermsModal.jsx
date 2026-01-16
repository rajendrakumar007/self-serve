
import React from "react";
import Modal from "./Modal";

export default function TermsModal({ isOpen, onClose, onAgree }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms & Conditions" onAgree={onAgree}>
      <section className="space-y-4 leading-relaxed">
        <p className="text-textSecondary">
          Welcome to SELFSERVE. By accessing or using our application, you agree to these Terms & Conditions.
        </p>

        <h4 className="font-semibold">1. Use of Service</h4>
        <p>You must be at least 18 years old or have consent from a legal guardian. Do not misuse the service.</p>

        <h4 className="font-semibold">2. Accounts & Security</h4>
        <p>
          You are responsible for maintaining your account credentials and for any activity occurring under your account.
          Notify us immediately if you suspect unauthorised access.
        </p>

        <h4 className="font-semibold">3. Content & Ownership</h4>
        <p>
          All content, trademarks, and intellectual property belong to their respective owners. You may not copy,
          distribute, or create derivative works without permission.
        </p>

        <h4 className="font-semibold">4. Changes to Terms</h4>
        <p>We may update these Terms periodically. Continued use after changes means you accept the revised Terms.</p>

        <h4 className="font-semibold">5. Limitation of Liability</h4>
        <p>
          The service is provided “as is”. We are not liable for indirect or consequential damages arising from your use
          of the service.
        </p>

        <h4 className="font-semibold">6. Contact</h4>
        <p>
          For questions, contact us at <span className="font-mono">support@selfserve.com</span>.
        </p>
      </section>
    </Modal>
  );
}
