import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

import {
  FaShieldAlt,
  FaRupeeSign,
} from "react-icons/fa";
import Navbar from "../common/Navbar";
import { getCurrentUserId } from "../../utils/auth/auth";
import { getPayments, getRenewals } from "../../utils/payments/payment";
import { getNotifications } from "../../utils/notifications/notifications";
import PaymentMethodModal from "./PaymentMethodModal";
import { API_BASE } from "../../utils/auth/auth";
import { contextualAddOns } from "./RenewalDetails";

/* Utils */
const INR = (n = 0) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const isoToday = () => new Date().toISOString().split("T")[0];
const addYearsToIso = (iso, years = 0) => {
  const d = new Date(iso);
  d.setFullYear(d.getFullYear() + Number(years || 0));
  return d.toISOString().split("T")[0];
};
const isTruthy = (v) => !!v;

const deriveSource = (state) => {
  const fp = state?.fromPath?.toLowerCase() || "";
  const mode = (state?.mode || "").toUpperCase();

  if (fp.includes("renew")) return "RENEWAL";
  if (mode === "PREMIUM" || fp.includes("pay-premiums")) return "PREMIUM";
  return "PURCHASE";
};

const postNotification = async ({ userId, message, type }) => {
  const nowIso = isoToday();
  const year = new Date().getFullYear();
  const notifications = getNotifications();
  const notification = {
    notificationId: `NTF-${year}-${String(notifications.length + 1).padStart(4, "0")}`,
    userId,
    type,
    message,
    read: false,
    sentDate: nowIso,
  };
  await axios.post(`${API_BASE}/notifications`, notification);
  return notification;
};

const resolvePolicyRecordId = async ({ policy, userId }) => {
  if (policy?.id) return policy.id;

  const { data } = await axios.get(
    `${API_BASE}/policies?userId=${encodeURIComponent(userId)}&policyId=${encodeURIComponent(policy.policyId)}`
  );

  if (Array.isArray(data) && data.length > 0 && data[0]?.id) return data[0].id;

  throw new Error("Policy record not found to update.");
};

const patchPolicyDates = async ({ policy, userId, startDateIso, tenureYears }) => {
  const recordId = await resolvePolicyRecordId({ policy, userId });
  const newStart = startDateIso;
  const newEnd = addYearsToIso(newStart, tenureYears);

  const payload = {
    startDate: newStart,
    endDate: newEnd,
    status: "ACTIVE",
    tenure: Number(tenureYears) || Number(policy?.tenure) || 1,
  };

  const { data } = await axios.patch(`${API_BASE}/policies/${recordId}`, payload);
  return { updated: data, newStart, newEnd };
};

const createPayment = async ({ userId, policyId, amount, method, type }) => {
  const payments = getPayments();
  const year = new Date().getFullYear();

  const payment = {
    paymentId: `PAY-${year}-${String(payments.length + 1).padStart(4, "0")}`,
    userId,
    policyId,
    amount,
    method,
    type,
    status: "SUCCESS",
    paymentDate: isoToday(),
  };

  const { data } = await axios.post(`${API_BASE}/payments`, payment);
  return data;
};

const createRenewal = async ({ userId, policyId }) => {
  const renewals = getRenewals();
  const year = new Date().getFullYear();

  const renewal = {
    renewalId: `RNW-${year}-${String(renewals.length + 1).padStart(4, "0")}`,
    policyId,
    userId,
    renewalDate: isoToday(),
    status: "SUCCESS",
  };

  const { data } = await axios.post(`${API_BASE}/renewals`, renewal);
  return data;
};

const createPolicy = async ({
  userId,
  policy,
  startDateIso,
  tenureYears,
  totalPayable,
  finalPerks,
}) => {
  const endDate = addYearsToIso(startDateIso, tenureYears);
  const { type, title, sumInsured, terms } = policy;

  const payload = {
    userId,
    policyId: policy.policyId,
    startDate: startDateIso,
    endDate,
    status: "ACTIVE",
    documentUrl: `/docs/${userId}.pdf`,
    type,
    title,
    perks: finalPerks,
    sumInsured,
    premium: Number(totalPayable) || 0,
    terms,
    tenure: Number(tenureYears) || 1,
  };

  const { data } = await axios.post(`${API_BASE}/policies`, payload);
  return { created: data, endDate };
};

/* Checkout Component */
export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const selectedTenureYears = state?.selectedTenureYears;
  const policy = state?.policy ?? state?.selectedPolicy;
  const breakdown = state?.breakdown || null;

  const totalPayable =
    state?.totalPayable ??
    state?.breakdown?.totalPayable ??
    policy?.premium ??
    0;

  const planName = policy?.title || policy?.name;

  if (!policy) {
    return (
      <>
        <Navbar />
        <div className="p-10">No payment context found.</div>
      </>
    );
  }

  const [openModal, setOpenModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const gst = (Number(totalPayable) * 18) / 100;
  const total = Number(totalPayable) + gst;

  /* Add-ons labels (unchanged) */
  const selectedAddOns = state?.selectedAddOns || {};
  const catalog = contextualAddOns(policy.type);
  const keyToLabel = Object.fromEntries(catalog.map((a) => [a.key, a.label]));
  const chosenAddOnLabels = Object.entries(selectedAddOns)
    .filter(([, v]) => isTruthy(v))
    .map(([key]) => keyToLabel[key] ?? key);
  const originalPerks = Array.isArray(policy?.perks) ? policy.perks : [];
  const finalPerks = Array.from(new Set([...originalPerks, ...chosenAddOnLabels]));

  /* Confirm Pay */
  const onConfirmPay = async (method) => {
    if (isPaying) return;
    setIsPaying(true);

    const userId = getCurrentUserId();
    const todayIso = isoToday();
    const source = deriveSource(state); // "RENEWAL" | "PREMIUM" | "PURCHASE"

    try {
      //RENEWAL FLOW
      if (source === "RENEWAL") {
        // 1) ADD payment history for renewal
        await createPayment({
          userId,
          policyId: policy.policyId,
          amount: total,
          method,
          type: "Renewal",
        });

        // 2) Create renewal record
        const savedRenewal = await createRenewal({
          userId,
          policyId: policy.policyId,
        });

        // 3) Update policy coverage dates
        const tenureYears =
          Number(policy?.tenure) || Number(selectedTenureYears) || 1;

        const { newStart, newEnd } = await patchPolicyDates({
          policy,
          userId,
          startDateIso: todayIso,
          tenureYears,
        });

        // 4) Notification
        await postNotification({
          userId,
          type: "Renewal",
          message: `Your renewal for ${planName} was successful. Coverage updated: ${newStart} → ${newEnd}.`,
        });

        navigate("/payment-success", {
          state: { renewal: savedRenewal, mode: "RENEWAL" },
          replace: true,
        });

        return;
      }

      if (source === "PREMIUM") {
        await createPayment({
          userId,
          policyId: policy.policyId,
          amount: total,
          method,
          type: "Premium",
        });

        await postNotification({
          userId,
          type: "Payment",
          message: `Your premium payment of ${INR(total)} for ${planName} was successful.`,
        });

        navigate("/payment-success", {
          state: { payment: { amount: total, method }, mode: "PAYMENT" },
          replace: true,
        });

        return;
      }

      //PURCHASE FLOW
      // 1) Payment
      await createPayment({
        userId,
        policyId: policy.policyId,
        amount: total,
        method,
        type: "Premium",
      });

      // 2) Create new policy object
      const tenureYears = Number(selectedTenureYears) || 1;
      const { endDate } = await createPolicy({
        userId,
        policy,
        startDateIso: todayIso,
        tenureYears,
        totalPayable,
        finalPerks,
      });

      // 3) Notification
      await postNotification({
        userId,
        type: "Payment",
        message: `Your purchase of ${planName} was successful. Policy active ${todayIso} → ${endDate}.`,
      });

      navigate("/payment-success", {
        state: { payment: { amount: total, method }, mode: "PAYMENT" },
        replace: true,
      });
    } catch (error) {
      console.error("Checkout persistence failed:", error);

      try {
        const s = deriveSource(state);
        const type = s === "RENEWAL" ? "Renewal" : "Payment";
        const msg =
          s === "RENEWAL"
            ? `Your renewal for ${planName} could not be processed.`
            : `Your payment for ${planName} could not be processed.`;

        await postNotification({ userId, type, message: msg });
      } catch {}

      navigate("/payment-failure", {
        state: {
          reason: "Checkout could not be saved",
          amount: totalPayable,
          policy,
          mode: source === "RENEWAL" ? "RENEWAL" : "PAYMENT",
        },
        replace: true,
      });
    } finally {
      setIsPaying(false);
      setOpenModal(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Header */}
          <header className="mb-6 sm:mb-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FaShieldAlt />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Checkout</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Review summary and complete your {deriveSource(state) === "RENEWAL" ? "renewal" : deriveSource(state) === "PREMIUM" ? "premium" : "purchase"}.
                </p>
              </div>
            </div>
          </header>

          {/* Summary + Pay */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Summary */}
            <section className="lg:col-span-7 bg-bgCard dark:bg-slate-800 border border-borderDefault dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                {deriveSource(state) === "RENEWAL" ? "Renewal" : deriveSource(state) === "PREMIUM" ? "Premium" : "Payment"} Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Plan</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right ml-3 truncate">
                    {planName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Type</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{policy?.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Policy ID</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {policy?.policyId ?? policy?.id}
                  </span>
                </div>

                {/* Add-ons (labels) */}
                {chosenAddOnLabels.length > 0 && (
                  <div className="pt-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Add-ons to be included</p>
                    <ul className="mt-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                      {chosenAddOnLabels.map((label) => (
                        <li key={label}>{label}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Renewal-only */}
              {Boolean(breakdown) && (
                <>
                  <div className="border-t border-dashed border-slate-300 dark:border-slate-600 my-4" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Premium Breakdown
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Base Premium</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {INR(breakdown?.basePremium || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Add-ons</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {INR(breakdown?.addOnsTotal || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">NCB Discount</span>
                      <span className="font-semibold text-green-600">
                        - {INR(breakdown?.ncbDiscount || 0)}
                      </span>
                    </div>
                    {Number(breakdown?.earlyBirdDiscount) > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Early-bird Discount</span>
                        <span className="font-semibold text-green-600">
                          - {INR(breakdown?.earlyBirdDiscount || 0)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Sub Total</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {INR(breakdown?.subTotal || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">GST</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {INR(breakdown?.gstAmount || 0)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* Pay Card */}
            <aside className="lg:col-span-5">
              <div className="bg-bgCard dark:bg-slate-800 border border-borderDefault dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Amount</h2>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">Premium</span>
                  <span className="text-slate-600 dark:text-blue-400">
                    {INR(totalPayable)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">GST(18%)</span>
                  <span className="text-slate-600 dark:text-blue-400">
                    {INR(gst)}
                  </span>
                </div>
                <br />
                <div className="flex items-center justify-between text-md">
                  <span className="text-slate-600 dark:text-slate-300">Total</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {INR(total)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.history.back()}
                    className="px-3 py-2 text-sm rounded-md border border-borderDefault dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-center"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setOpenModal(true)}
                    disabled={isPaying}
                    className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {isPaying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <FaRupeeSign /> Choose Payment Mode
                      </>
                    )}
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* Mobile Sticky Pay Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bgCard dark:bg-slate-800 border-t border-borderDefault dark:border-slate-700 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Total</p>
              <p className="text-base font-bold text-blue-600 dark:text-blue-400">{INR(total)}</p>
            </div>
            <button
              onClick={() => setOpenModal(true)}
              disabled={isPaying}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay
            </button>
          </div>
          </div>
      <PaymentMethodModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirmPay={onConfirmPay}
        amount={total}
      />
      </div>
    </>
  )
}
