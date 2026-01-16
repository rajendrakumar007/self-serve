
import {
  FaCreditCard,
  FaMobileAlt
} from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { SiGooglepay,SiPhonepe,SiPaytm } from "react-icons/si";
import gpayIcon from "../../assets/gpay.svg"
import phonepeIcon from "../../assets/ppay.svg"
import bhimIcon from "../../assets/bhimupi.png"
import paytmIcon from "../../assets/paytmpay.webp"

const INR = (n = 0) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function PaymentMethodModal({
  open,
  onClose,
  onConfirmPay,
  amount,
  initialMethod = "upi",
}) {
  // Methods: only UPI and Card (NetBanking removed)
  const METHODS = [
    { key: "upi", label: "UPI", icon: <FaMobileAlt /> },
    { key: "card", label: "Card", icon: <FaCreditCard /> },
  ];

  const UPI_APPS = [
    { key: "phonepe", label: "PhonePe" , icon : phonepeIcon},
    { key: "gpay", label: "Google Pay",icon : gpayIcon},
    { key: "paytm", label: "Paytm",icon :paytmIcon },
    { key: "bhim", label: "Bhim",icon :bhimIcon }
  ];

  const [method, setMethod] = useState(initialMethod);
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiry, setExpiry] = useState(""); // MM/YY
  const [cvv, setCvv] = useState("");

  const [errors, setErrors] = useState({});

  if (!open) return null;

  // Validation Helpers

  // Luhn check for card number validity
  const luhnCheck = (num) => {
    const sanitized = num.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(sanitized)) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const validateCard = () => {
    const nextErrors = {};

    // Card Number
    const num = cardNumber.replace(/\s+/g, "");
    if (!num) {
      nextErrors.cardNumber = "Card number is required.";
    } else if (!/^\d{13,19}$/.test(num)) {
      nextErrors.cardNumber = "Card number must be 13–19 digits.";
    } else if (!luhnCheck(num)) {
      nextErrors.cardNumber = "Invalid card number.";
    }

    // Name on Card
    const nameTrim = nameOnCard.trim();
    if (!nameTrim) {
      nextErrors.nameOnCard = "Name on card is required.";
    } else if (!/^[A-Za-z ]+$/.test(nameTrim)) {
      nextErrors.nameOnCard = "Only letters and spaces are allowed.";
    } else if (nameTrim.length < 2) {
      nextErrors.nameOnCard = "Please enter a valid name.";
    }

    // Expiry MM/YY
    const exp = expiry.trim();
    if (!exp) {
      nextErrors.expiry = "Expiry is required.";
    } else if (!/^\d{2}\/\d{2}$/.test(exp)) {
      nextErrors.expiry = "Use format MM/YY.";
    } else {
      const [mmStr, yyStr] = exp.split("/");
      const mm = parseInt(mmStr, 10);
      const yy = parseInt(yyStr, 10);
      if (mm < 1 || mm > 12) {
        nextErrors.expiry = "Month must be 01–12.";
      } else {
        // Check not in the past
        const now = new Date();
        const currYY = now.getFullYear() % 100; // last two digits
        const currMM = now.getMonth() + 1;
        if (yy < currYY || (yy === currYY && mm < currMM)) {
          nextErrors.expiry = "Card is expired.";
        }
      }
    }

    // CVV
    const cvvSan = cvv.trim();
    if (!cvvSan) {
      nextErrors.cvv = "CVV is required.";
    } else if (!/^\d{3,4}$/.test(cvvSan)) {
      nextErrors.cvv = "CVV must be 3 or 4 digits.";
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const handlePay = () => {
    if (method === "upi") {
      if (!selectedUpiApp) {
        setErrors({ upiApp: "Please select a UPI app." });
        return;
      }
      // All good — proceed
      onConfirmPay("upi");
      return;
    }

    if (method === "card") {
      const errs = validateCard();
      if (Object.keys(errs).length > 0) return; // Block if errors exist
      onConfirmPay("card");
      return;
    }
  };

  const formatCardNumber = (value) => {
    // Keep digits only, group in 4s: 1234 5678 ...
    return value
      .replace(/\D/g, "")
      .slice(0, 19)
      .replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleExpiryInput = (value) => {
    // Auto-insert slash: "MM/YY"
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-xl bg-bgCard dark:bg-slate-800 border border-borderDefault dark:border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-borderDefault dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select Payment Mode</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close"
          >
            <RxCross2 className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Methods */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {METHODS.map((m) => {
              const active = method === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => {
                    setMethod(m.key);
                    setErrors({});
                  }}
                  className={`p-3 rounded-lg border-2 text-left transition-all flex items-center justify-between ${
                    active
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-700/50"
                  }`}
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white inline-flex items-center gap-2">
                    {m.icon} {m.label}
                  </span>
                  {active && <span className="text-xs text-blue-600 dark:text-blue-400">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Method-specific UI */}
          <div className="mt-1 space-y-3">
            {/* UPI: show apps */}
            {method === "upi" && (
              <>
                <p className="text-xs text-slate-600 dark:text-slate-400">Choose your UPI app</p>
                <div className="grid grid-cols-3 gap-2">
                  {UPI_APPS.map((app) => {
                    const active = selectedUpiApp === app.key;
                    return (
                      <button
                        key={app.key}
                        type="button"
                        onClick={() => {
                          setSelectedUpiApp(app.key);
                          setErrors((prev) => ({ ...prev, upiApp: undefined }));
                        }}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          active
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "border-slate-200 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white"
                        }`}
                      >
                        <img src={app.icon} />                        
                      </button>
                    );
                  })}
                </div>
                {errors.upiApp && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.upiApp}</p>
                )}
              </>
            )}

            {/* Card: fields + validation */}
            {method === "card" && (
              <div className="space-y-2">
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="1234 5678 1234 5678"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
                {errors.cardNumber && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.cardNumber}</p>
                )}

                <input
                  type="text"
                  placeholder="Name on Card"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
                {errors.nameOnCard && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.nameOnCard}</p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(handleExpiryInput(e.target.value))}
                    maxLength={5}
                    className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 px-3 py-2 text-sm text-slate-900 dark:text-white"
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 px-3 py-2 text-sm text-slate-900 dark:text-white"
                  />
                </div>
                {(errors.expiry || errors.cvv) && (
                  <div className="space-y-1">
                    {errors.expiry && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.expiry}</p>
                    )}
                    {errors.cvv && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.cvv}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-borderDefault dark:border-slate-700 flex items-center justify-between">
          <div className="text-sm">
            <p className="text-slate-600 dark:text-slate-300">Amount to pay</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{INR(amount)}</p>
          </div>
          <button
            onClick={handlePay}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Pay {INR(amount)}
          </button>
        </div>
      </div>
    </div>
  );
}
