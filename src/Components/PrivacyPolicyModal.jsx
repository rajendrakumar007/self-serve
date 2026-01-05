
import React from "react";
import Modal from "./Modal";

export default function PrivacyPolicyModal({ isOpen, onClose, onAgree }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy" onAgree={onAgree}>
      <section className="space-y-4 leading-relaxed">
        <p className="text-textSecondary">
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use
          SELFSERVE.
        </p>

        <h4 className="font-semibold">1. Information We Collect</h4>
        <ul className="list-disc ml-6 space-y-1">
          <li>Account details : name, email, contact number.</li>
          <li>Authentication-related data.</li>
          <li>Usage data and device information for performance and analytics.</li>
        </ul>

        <h4 className="font-semibold">2. How We Use Information</h4>
        <ul className="list-disc ml-6 space-y-1">
          <li>To create and maintain your account.</li>
          <li>To provide and improve the service.</li>
          <li>To communicate updates, security notices, and support messages.</li>
        </ul>

        <h4 className="font-semibold">3. Sharing & Disclosure</h4>
        <p>
          We do not sell your personal data. We may share information with trusted providers strictly for service
          delivery, analytics, and compliance, subject to contractual obligations.
        </p>

        <h4 className="font-semibold">4. Data Security</h4>
        <p>
          We apply reasonable safeguards to protect your data. No method of transmission or storage is 100% secure, but
          we strive to use best practices.
        </p>

        <h4 className="font-semibold">5. Your Rights</h4>
        <ul className="list-disc ml-6 space-y-1">
          <li>Access, update, or delete your account data.</li>
          <li>Withdraw consent where applicable.</li>
          <li>Contact us for privacy-related queries.</li>
        </ul>

        <h4 className="font-semibold">6. Changes</h4>
        <p>
          We may update this Privacy Policy occasionally. Continued use after updates indicates acceptance of the revised
          policy.
        </p>

        <h4 className="font-semibold">7. Contact</h4>
        <p>
          For privacy concerns reach us at <span className="font-mono">support@selfserve.com</span>
        </p>
      </section>
    </Modal>
  );
}
