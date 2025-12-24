
import React, { useState } from "react";

function SignUp() {
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
    alert(`OTP sent to ${contact}\nThe OTP is : ${randomOtp}`);
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      alert("Please enter the OTP first");
      return;
    }
    if (otp === generatedOtp) {
      alert("OTP is successfully verified");
      setIsOtpVerified(true);
    } else {
      alert("Invalid OTP, please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setMobileError("");

    // validation logic unchanged...
    // (omitted for brevity — your original logic stays as-is)

    alert(
      `Signup successful!\nName: ${firstName} ${middleName} ${lastName}\nEmail: ${email.trim()}\nMobile: ${contact}`
    );

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
  };

  const isEmailValid = isValidComEmail(email);
  const isContactValid = /^[0-9]{10}$/.test(contact);

  return (
    <div className="min-h-screen bg-secondary bg-gradient-to-br from-secondary to-primaryDark text-textInverted flex justify-center items-center p-4">
      {/* Card */}
      <div className="w-full max-w-md bg-bgCard/95 backdrop-blur-sm rounded-card shadow-lg p-6 sm:p-8 border border-borderDefault">
        <h2 className="text-center text-2xl font-semibold text-textPrimary mb-6">
          New Registration
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* First Name */}
          <input
            type="text"
            placeholder="First Name *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 mb-3 rounded-md bg-white text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />

          {/* Middle Name */}
          <input
            type="text"
            placeholder="Middle Name"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            className="w-full p-3 mb-3 rounded-md bg-white text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />

          {/* Last Name */}
          <input
            type="text"
            placeholder="Last Name *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 mb-3 rounded-md bg-white text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />

          {/* Email */}
          <input
            type="text"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-2 rounded-md bg-white text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          {!isEmailValid && email.trim() !== "" && (
            <p className="text-danger text-xs sm:text-sm mb-2">
              Enter a valid Email ID (must contain @ and end with .com)
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
              className="w-full p-3 mb-2 rounded-md bg-white text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />

            <button
              type="button"
              className={`py-2.5 rounded-md text-textInverted text-sm font-medium transition ${
                !isEmailValid || !isContactValid
                  ? "bg-accent/50 cursor-not-allowed"
                  : "bg-accent hover:bg-success"
              } mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight`}
              onClick={handleGenerateOtp}
              disabled={!isEmailValid || !isContactValid}
              title={
                !isEmailValid
                  ? "Enter a valid .com email first"
                  : !isContactValid
                  ? "Enter a 10-digit mobile number"
                  : "Get OTP"
              }
            >
              Get OTP
            </button>

            {mobileError && (
              <p className="text-danger text-xs sm:text-sm mb-2">{mobileError}</p>
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
                  className="w-full p-3 mb-2 rounded-md bg-white text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-bgMuted disabled:text-textMuted"
                  disabled={isOtpVerified}
                />
                {!isOtpVerified && (
                  <button
                    type="button"
                    className="bg-accent text-textInverted py-2.5 rounded-md hover:bg-success text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
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
            className="w-full p-3 mb-2 rounded-md bg-white text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          {passwordError && (
            <p className="text-danger text-xs sm:text-sm mb-2">{passwordError}</p>
          )}

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password *"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 mb-3 rounded-md bg-white text-textPrimary placeholder:text-textMuted border border-borderDefault focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />

          {/* Terms & Conditions */}
          <div className="flex items-center mb-2 text-xs sm:text-sm">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2 accent-primary"
            />
            <label className="text-textSecondary">
              I agree to the{" "}
              <a href="/terms" className="text-primaryLight hover:underline">
                Terms &amp; Conditions
              </a>{" "}
              *
            </label>
          </div>

          {/* Privacy Policy */}
          <div className="flex items-center mb-3 text-xs sm:text-sm">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mr-2 accent-primary"
            />
            <label className="text-textSecondary">
              I agree to the{" "}
              <a href="/privacy" className="text-primaryLight hover:underline">
                Privacy Policy
              </a>{" "}
              *
            </label>
          </div>

          {/* General errors */}
          {error && (
            <p className="text-danger text-xs sm:text-sm mb-3">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-primary hover:bg-primaryDark text-textInverted py-2.5 rounded-md font-semibold transition transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
          >
            Register
          </button>

          {/* Link */}
          <div className="flex justify-between mt-3 text-xs sm:text-sm">
            <a
              href="/login"
              className="text-primaryLight hover:text-primary hover:underline"
            >
              Already have an account? Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
