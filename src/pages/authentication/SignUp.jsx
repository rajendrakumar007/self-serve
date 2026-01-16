import TermsModal from "../../components/auth/TermsModal";
import PrivacyPolicyModal from "../../components/auth/PrivacyPolicyModal";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, findUserByEmail } from "../../utils/auth/auth";
import { FaShieldAlt, FaBullhorn, FaTools, FaFileAlt } from "react-icons/fa";

function SignUp() {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showExists, setShowExists] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  const showToast = (type, message, ms = 2200) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), ms);
  };

  // If the email field loses focus and user exists, redirect to login
  const handleEmailBlur = async () => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !isValidComEmail(normalized)) return;
    try {
      const user = await findUserByEmail(normalized);
      if (user) {
        setShowExists(true);
        // clear fields
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setContact("");
        setOtp("");
        setGeneratedOtp("");
        setTermsAccepted(false);
        setPrivacyAccepted(false);
        setIsOtpVerified(false);
        setTimeout(() => {
          setShowExists(false);
          navigate("/login");
        }, 2000);
      }
    } catch (e) {
      // ignore network errors here
    }
  };

  const validatePassword = (pwd) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    return pattern.test(pwd);
  };

  const isValidComEmail = (rawEmail) => {
    const normalized = rawEmail.trim().toLowerCase();
    if (!normalized) return false;
    const pattern = /^[^@\s]+@([a-z0-9-]+\.)*[a-z0-9-]+\.com$/;
    return pattern.test(normalized);
  };

  const handleGenerateOtp = () => {
    if (!email || !isValidComEmail(email)) {
      setError("Enter a valid Email ID");
      return;
    }
    if (!contact) {
      setMobileError("Please enter the mobile number first");
      return;
    }
    if (!/^[0-9]{10}$/.test(contact)) {
      setMobileError("Mobile number must be exactly 10 digits");
      return;
    }
    setError("");
    setMobileError("");
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setIsOtpVerified(false);
    showToast("info", `The OTP is : ${randomOtp}`, 15000);
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      showToast("error", "Please enter the OTP first");
      return;
    }
    if (otp === generatedOtp) {
      showToast("success", "OTP successfully verified");
      setIsOtpVerified(true);
    } else {
      showToast("error", "Invalid OTP, please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setMobileError("");

    // Basic validations
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!isValidComEmail(email)) {
      setError("Enter a valid .com email");
      return;
    }
    if (!/^[0-9]{10}$/.test(contact)) {
      setMobileError("Mobile number must be exactly 10 digits");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be 8-15 chars with upper, lower, number & special char"
      );
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (!isOtpVerified) {
      setError("Please verify the OTP sent to your mobile number");
      return;
    }
    if (!termsAccepted || !privacyAccepted) {
      setError("You must accept Terms & Privacy to register");
      return;
    }

    // Register
    const result = await registerUser({
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      contact,
    });

    if (!result.ok) {
      // If email already exists, show a small banner and redirect to login
      if (result.message && /email already registered/i.test(result.message)) {
        setShowExists(true);
        // Reset fields
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setContact("");
        setOtp("");
        setGeneratedOtp("");
        setTermsAccepted(false);
        setPrivacyAccepted(false);
        setIsOtpVerified(false);
        setTimeout(() => {
          setShowExists(false);
          navigate("/login");
        }, 900);
        return;
      }
      setError(result.message || "Unable to register");
      return;
    }

    // Show a small success popup (like Login page) and redirect to /login
    setShowSuccess(true);
    // Reset fields
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setContact("");
    setOtp("");
    setGeneratedOtp("");
    setTermsAccepted(false);
    setPrivacyAccepted(false);
    setIsOtpVerified(false);

    // Redirect to login after small delay (keep banner visible briefly)
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/login");
    }, 4000);
  };

  const isEmailValid = isValidComEmail(email);
  const isContactValid = /^[0-9]{10}$/.test(contact);

  return (
   
<div className="min-h-screen w-full bg-bgBase dark:bg-secondary text-textPrimary dark:text-textInverted flex items-center justify-center p-4">
  {/* Shell - same split grid as Login */}
  <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl shadow-xl border border-borderDefault dark:border-borderStrong overflow-hidden bg-bgCard/70 dark:bg-secondary/80 backdrop-blur-sm">
    
    {/* LEFT: Form section */}
    <div className="px-6 sm:px-8 py-8 bg-bgCard dark:bg-secondary">
      {/* Brand + Toast (badge beside brand, same as Login) */}
      <div className="flex items-center gap-4 mb-8">
        <FaShieldAlt className="text-primary text-2xl" />
        <span onClick={()=>navigate("/")} className="tracking-tight text-2xl font-extrabold text-textPrimary dark:text-textInverted cursor-pointer">
          SELFSERVE
        </span>

        {/* Toast badge */}
        {toast.show && (
          <div
            className={`rounded-md shadow-md px-3 py-1.5 text-xs font-medium animate-slideDown ${
              toast.type === "success"
                ? "bg-success text-textInverted"
                : toast.type === "error"
                ? "bg-danger text-textInverted"
                : "bg-primary text-textInverted"
            }`}
            role="alert"
          >
            {toast.message}
          </div>
        )}

        {/* Success & Exists banners (compact, like Login) */}
        {showSuccess && (
          <div className="rounded-md shadow-md px-3 py-1.5 text-xs font-large animate-slideDown bg-success text-textInverted">
            <span className="font-semibold px-3">Registration successful</span>
            <span className="text-xs opacity-90">Redirecting…</span>
          </div>
        )}
        {showExists && (
          <div className="rounded-md shadow-md px-3 py-1.5 text-xs font-medium animate-slideDown bg-warning text-textInverted">
            <span className="font-semibold">Account already exists</span>
            <span className="text-xs opacity-90">Redirecting to login…</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-textPrimary dark:text-textInverted mb-2">
        New Registration
      </h2>
      <p className="text-sm text-textMuted dark:text-textSecondary mb-6">
        Create your account to manage and view your policy details.
      </p>

      {/* Form (same functionality, polished inputs/buttons like Login) */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* First Name */}
        <input
          type="text"
          placeholder="First Name *"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-2.5 mb-3 rounded-md bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight transition"
        />

        {/* Middle Name */}
        <input
          type="text"
          placeholder="Middle Name"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          className="w-full px-4 py-2.5 mb-3 rounded-md bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight transition"
        />

        {/* Last Name */}
        <input
          type="text"
          placeholder="Last Name *"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-4 py-2.5 mb-3 rounded-md bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight transition"
        />

        {/* Email */}
        <input
          type="text"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailBlur}
          className="w-full px-4 py-2.5 mb-2 rounded-md bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight transition"
        />
        {!isValidComEmail(email) && email.trim() !== "" && (
          <p className="text-danger dark:text-textInverted text-xs sm:text-sm mb-2">
            Enter a valid Email ID
          </p>
        )}

        {/* Contact + OTP */}
        <div className="flex flex-col mb-3">
          <input
            type="text"
            placeholder="Contact Number *"
            value={contact}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setContact(value);
            }}
            maxLength={10}
            className="w-full px-4 py-2.5 mb-2 rounded-md bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight transition"
          />

          <button
            type="button"
            className={`py-2.5 rounded-md text-textInverted text-sm font-medium transition ${
              !isValidComEmail(email) || !/^[0-9]{10}$/.test(contact)
                ? "bg-primary/60 cursor-not-allowed"
                : "bg-primaryGradient hover:scale-[1.02] shadow-md"
            } mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight`}
            onClick={handleGenerateOtp}
            disabled={!isValidComEmail(email) || !/^[0-9]{10}$/.test(contact)}
            title={
              !isValidComEmail(email)
                ? "Enter a valid .com email first"
                : !/^[0-9]{10}$/.test(contact)
                ? "Enter a 10-digit mobile number"
                : "Get OTP"
            }
          >
            Get OTP
          </button>

          {mobileError && (
            <p className="text-danger dark:text-textInverted text-xs sm:text-sm mb-2">
              {mobileError}
            </p>
          )}

          {generatedOtp && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setOtp(value);
                }}
                maxLength={6}
                className="w-full px-4 py-2.5 mb-2 rounded-md bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight text-center tracking-widest text-lg font-semibold transition disabled:bg-bgMuted dark:disabled:bg-secondary/70 disabled:text-textMuted dark:disabled:text-textSecondary"
                disabled={isOtpVerified}
              />

              {!isOtpVerified && (
                <button
                  type="button"
                  className="bg-primary text-textInverted py-2.5 rounded-md hover:bg-primaryDark text-sm font-medium shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
              )}
            </>
          )}
        </div>

        {/* Password */}
        <input
          type="password"
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 mb-2 rounded-md bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight transition"
        />
        {passwordError && (
          <p className="text-danger dark:text-textInverted text-xs sm:text-sm mb-2">
            {passwordError}
          </p>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password *"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2.5 mb-3 rounded-md bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight transition"
        />

        {/* Terms & Conditions */}
        <div className="flex items-center mb-2 text-xs sm:text-sm gap-2">
          <input
            id="termsAccepted"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="accent-primary"
          />
          <label
            htmlFor="termsAccepted"
            className="text-textMuted dark:text-textSecondary cursor-pointer"
          >
            I agree to the
          </label>
          <button
            type="button"
            className="text-primary hover:text-primaryDark hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight rounded-sm"
            onClick={() => setShowTerms(true)}
          >
            Terms &amp; Conditions
          </button>
        </div>

        {/* Privacy Policy */}
        <div className="flex items-center mb-3 text-xs sm:text-sm gap-2">
          <input
            id="privacyAccepted"
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="accent-primary"
          />
          <label
            htmlFor="privacyAccepted"
            className="text-textMuted dark:text-textSecondary cursor-pointer"
          >
            I agree to the
          </label>
          <button
            type="button"
            className="text-primary hover:text-primaryDark hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight rounded-sm"
            onClick={() => setShowPrivacy(true)}
          >
            Privacy Policy
          </button>
        </div>

        {/* Legal modals */}
        <TermsModal
          isOpen={showTerms}
          onClose={() => setShowTerms(false)}
          onAgree={() => {
            setTermsAccepted(true);
            setShowTerms(false);
          }}
        />
        <PrivacyPolicyModal
          isOpen={showPrivacy}
          onClose={() => setShowPrivacy(false)}
          onAgree={() => {
            setPrivacyAccepted(true);
            setShowPrivacy(false);
          }}
        />

        {/* General errors */}
        {error && (
          <p className="text-danger dark:text-textInverted text-xs sm:text-sm mb-3">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="py-2.5 rounded-md bg-primary text-textInverted hover:bg-primaryDark font-semibold transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
        >
          Register
        </button>

        {/* Link */}
        <div className="flex justify-between mt-3 text-xs sm:text-sm">
          <a href="/login">Already have an account? <span className="text-primary">Login</span> </a>
        </div>
      </form>
    </div>

    {/* RIGHT: Info panel — hidden on mobile (same as Login) */}
    <div className="relative bg-bgMuted dark:bg-secondary p-8 md:p-10 border-l border-borderDefault dark:border-borderStrong hidden md:block">
      <div className="mx-auto max-w-sm">
        <div className="mt-10 flex items-center justify-center gap-4 mb-10">
          <img src={"src/assets/insurance.png"} alt="insurance" />
        </div>

        <h3 className="text-xl font-semibold text-textPrimary dark:text-textInverted text-center">
          Take control of your policy
        </h3>
        <p className="text-sm text-textMuted dark:text-textSecondary text-center mt-2">
          Inside your account you can:
        </p>

        {/* Features row */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full grid place-items-center bg-bgCard dark:bg-secondary border border-borderDefault dark:border-borderStrong text-textPrimary dark:text-textInverted">
              <FaBullhorn size={23} />
            </div>
            <span className="text-xs text-textPrimary dark:text-textInverted">File a claim</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full grid place-items-center bg-bgCard dark:bg-secondary border border-borderDefault dark:border-borderStrong text-textPrimary dark:text-textInverted">
              <FaTools size={23} />
            </div>
            <span className="text-xs text-textPrimary dark:text-textInverted">Manage your policy</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full grid place-items-center bg-bgCard dark:bg-secondary border border-borderDefault dark:border-borderStrong text-textPrimary dark:text-textInverted">
              <FaFileAlt size={23} />
            </div>
            <span className="text-xs text-textPrimary dark:text-textInverted">View policy docs</span>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center text-xs text-textMuted dark:text-textSecondary">
          Safe • Secure • Hassle-free
        </div>
      </div>
    </div>
  </div>

  {/* Slide-down animation keyframes (same used in Login) */}
  <style>{`
    @keyframes slideDown {
      0% { opacity: 0; transform: translateY(-4px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-slideDown {
      animation: slideDown 0.25s ease-out forwards;
    }
  `}</style>
</div>

  );
}

export default SignUp;
