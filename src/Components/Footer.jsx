
// src/Components/Footer.jsx
import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import { FaWhatsapp, FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  // Dark mode: use a distinct surface + subtle separator and shadow
  // Light mode: keep your existing tokens
  const footerBg =
    theme === "dark"
      ? "bg-secondary text-textInverted shadow-[0_-8px_20px_rgba(0,0,0,0.3)] border-t border-borderDefault"
      : "bg-bgCard text-textPrimary shadow-[0_-8px_20px_rgba(0,0,0,0.10)] border-t border-borderDefault";

  // In dark mode, make muted text slightly brighter for readability
  const mutedText =
    theme === "dark" ? "text-textSecondary/90" : "text-textMuted";

  return (
    <footer className={`${footerBg} mt-6`}>
      <div className="max-w-xl mx-auto px-4 py-6 text-center">
        {/* Contact */}
        <div className="mb-4">
          <h4 className="text-base font-semibold mb-2">Contact</h4>
          <p className={`text-sm ${mutedText}`}>
            Email:{" "}
            <a
              href="mailto:support@selfserve.com"
              className="text-primary hover:text-primaryLight"
            >
              support@selfserve.com
            </a>
            <br />
            Phone:{" "}
            <a
              href="tel:+9118001234567"
              className="text-primary hover:text-primaryLight"
            >
              +91-1800 123 4567
            </a>
          </p>
        </div>

        {/* Legal */}
        <div className="mb-4">
          <h6 className="text-base font-semibold mb-2">Legal</h6>
          <div className={`flex justify-center gap-4 text-sm ${mutedText}`}>
            <Link to="/legal/terms" className="hover:text-primary">Terms</Link>
            <Link to="/legal/privacy" className="hover:text-primary">Privacy</Link>
            <Link to="/legal/refund" className="hover:text-primary">Refunds</Link>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-5 text-xl mb-4">
          {[FaWhatsapp, FaFacebook, FaInstagram, FaYoutube, FaTwitter].map((Icon, idx) => (
            <a
              key={idx}
              href="#"
              className="text-textSecondary hover:text-primary transition-transform hover:scale-110"
              aria-label="social link"
            >
              <Icon />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className={`text-xs ${mutedText}`}>
          © {new Date().getFullYear()} SELFSERVE. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
