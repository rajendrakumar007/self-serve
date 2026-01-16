import React, { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate , Link} from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext.jsx";
import { API_BASE, getCurrentUserId } from "../../utils/auth/auth.js";
import Navbar from "../../components/common/Navbar.jsx";

// Considered "near due" if within this many days.
const NEAR_DUE_DAYS = 15;

//Normalize a Date to local midnight for consistent day-diff math.
const atLocalMidnight = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

/**
 * Compute next annual premium due date between startDate and endDate.
 * FIX: First due is the 1st ANNIVERSARY (start + 1 year), not the start date.
 * Then move forward year-by-year until it's strictly in the future.
 * Returns a Date or null (if no upcoming premiums).
 */
const getNextAnnualDueDate = (startDate, endDate, now = new Date()) => {
  if (!startDate || !endDate) return null;

  const start = atLocalMidnight(new Date(startDate));
  const end = atLocalMidnight(new Date(endDate));
  const today = atLocalMidnight(now);

  // First due is 1 year after start
  let candidate = new Date(start);
  candidate.setFullYear(candidate.getFullYear() + 1);

  // Keep advancing by 1 year until due is strictly after today
  while (candidate <= today) {
    candidate.setFullYear(candidate.getFullYear() + 1);
  }

  // If the next anniversary goes beyond the policy end, there is no upcoming premium
  if (candidate > end) return null;

  return atLocalMidnight(candidate);
};

/**
 * Difference in days (ceil). next - today
 * Positive => days remaining; Negative => overdue by abs value.
 */
const daysUntil = (futureDate, now = new Date()) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = atLocalMidnight(futureDate).getTime() - atLocalMidnight(now).getTime();
  return Math.ceil(diff / msPerDay);
};

//Format a date nicely.
const formatDate = (d) => {
  try {
    return atLocalMidnight(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(d);
  }
};

/**
 * Fetch user's policies from your API.
 * Replace with your app’s actual endpoint or util if available.
 */
const fetchUserPolicies = async (userId) => {
  const res = await fetch(`${API_BASE}/policies?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Failed to fetch policies: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

const PayPremiums = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const userId = getCurrentUserId();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const items = await fetchUserPolicies(userId);

        // Show only the user's policies (defensive filter if backend returns more)
        const mine = items.filter((p) => p.userId === userId);

        if (mounted) setPolicies(mine);
      } catch (e) {
        if (mounted) setErr(e.message || "Something went wrong");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Compute next due date & days remaining for each policy
  const enriched = useMemo(() => {
    const today = new Date();
    return policies.map((p) => {
      // FIX: next due uses 1st anniversary logic
      const nextDue = getNextAnnualDueDate(p.startDate, p.endDate, today);

      const daysRemaining = nextDue ? daysUntil(nextDue, today) : null;

      return {
        ...p,
        _nextDueDate: nextDue, // Date or null
        _daysRemaining: daysRemaining, // number or null
        _isOverdue: typeof daysRemaining === "number" && daysRemaining < 0,
        _isNear:
          typeof daysRemaining === "number" &&
          daysRemaining >= 0 &&
          daysRemaining <= NEAR_DUE_DAYS,
        _hasUpcomingPremium: nextDue !== null,
      };
    });
  }, [policies]);

  // Sort by next due date ascending; overdue first, then near, then others
  const sorted = useMemo(() => {
    const byRank = (p) => {
      if (!p._hasUpcomingPremium) return 3;
      if (p._isOverdue) return 0;
      if (p._isNear) return 1;
      return 2;
    };
    return [...enriched].sort((a, b) => {
      const rA = byRank(a);
      const rB = byRank(b);
      if (rA !== rB) return rA - rB;

      // If both have upcoming premiums, sort by date
      if (a._hasUpcomingPremium && b._hasUpcomingPremium) {
        return a._nextDueDate - b._nextDueDate;
      }
      return 0;
    });
  }, [enriched]);

  const cardBase =
    theme === "dark"
      ? "rounded-lg ring-1 ring-borderStrong bg-bgCard text-textInverted p-4"
      : "rounded-lg ring-1 ring-borderDefault bg-bgCard text-textPrimary p-4";

  const cardDanger =
    theme === "dark"
      ? "ring-danger border border-danger/60 bg-danger/10"
      : "ring-danger border border-danger/60 bg-danger/10";

  const cardOverdue =
    theme === "dark"
      ? "ring-danger border border-danger bg-danger/20"
      : "ring-danger border border-danger bg-danger/20";

  const payBtn =
    theme === "dark"
      ? "px-4 py-2 rounded-md bg-primary text-textInverted hover:bg-primary/85 transition-colors"
      : "px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors";

  const mutedText =
    theme === "dark" ? "text-textSecondary" : "text-textSecondary";

  const labelChip =
    theme === "dark"
      ? "inline-block text-xs px-2 py-0.5 rounded-full bg-white/10 ring-1 ring-borderStrong"
      : "inline-block text-xs px-2 py-0.5 rounded-full bg-bgHover ring-1 ring-borderDefault";

  const onPayPremium = (policy) => {
    // Navigate to checkout with state containing policy details
    navigate("/checkout", {
      state: {
        policyId: policy.policyId ?? policy.id,
        userId: policy.userId,
        title: policy.title,
        type: policy.type,
        premiumAmount: policy.premium,
        sumInsured: policy.sumInsured,
        nextDueDate: policy._nextDueDate ? policy._nextDueDate.toISOString() : null,
        status: policy.status,
        documentUrl: policy.documentUrl,
        // Include full policy for flexibility on the checkout page
        policy,
        fromPath : location.pathname + location.search + location.hash
      },
      replace: false,
    });
  };

  return (
    <>
      <Navbar/>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Pay Premiums</h1>
          <p className={`${mutedText} mt-1`}>
            Review upcoming premium dues for your policies and pay securely.
          </p>
        </header>

        {loading && (
          <div className="space-y-3">
            <div className={`${cardBase} animate-pulse`}>
              <div className="h-4 w-48 bg-bgHover rounded mb-2" />
              <div className="h-3 w-64 bg-bgHover rounded mb-2" />
              <div className="h-3 w-40 bg-bgHover rounded mb-2" />
              <div className="h-9 w-28 bg-bgHover rounded mt-3" />
            </div>
            <div className={`${cardBase} animate-pulse`}>
              <div className="h-4 w-56 bg-bgHover rounded mb-2" />
              <div className="h-3 w-72 bg-bgHover rounded mb-2" />
              <div className="h-3 w-32 bg-bgHover rounded mb-2" />
              <div className="h-9 w-28 bg-bgHover rounded mt-3" />
            </div>
          </div>
        )}

        {!loading && err && (
          <div className={`${cardBase} ring-danger border border-danger bg-danger/10`}>
            <p className="text-danger font-medium">Unable to load policies.</p>
            <p className={`${mutedText} mt-1`}>{err}</p>
          </div>
        )}

        {!loading && !err && sorted.length === 0 && (
          <div className={cardBase}>
            <span>
              <p className="font-medium">No policies found for your account.</p>
              <Link to="/" className="text-primary">Explore Policies</Link>
            </span>
            <p className={`${mutedText} mt-1`}>
              If you believe this is an error, please contact Support.
            </p>
          </div>
        )}

        {!loading && !err && sorted.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.map((p) => {
              const isOverdue = p._isOverdue;
              const isNear = p._isNear;
              const hasUpcoming = p._hasUpcomingPremium;

              const days = p._daysRemaining;
              const dueLabel = hasUpcoming
                ? isOverdue
                  ? `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`
                  : `Due in ${days} day${days === 1 ? "" : "s"}`
                : "No upcoming premiums";

              const badge =
                isOverdue ? (
                  <span className="inline-flex items-center gap-2 text-danger font-semibold">
                    {dueLabel}
                  </span>
                ) : isNear ? (
                  <span className="inline-flex items-center gap-2 text-danger font-semibold">
                    {dueLabel}
                  </span>
                ) : (
                  <span className={`${mutedText}`}>{dueLabel}</span>
                );

              const cardTone = isOverdue
                ? `${cardBase} ${cardOverdue}`
                : isNear
                ? `${cardBase} ${cardDanger}`
                : cardBase;

              return (
                <div key={p.id ?? p.policyId} className={cardTone}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {p.title}{" "}
                        <span className={labelChip}>
                          {p.type?.toUpperCase()}
                        </span>
                      </h3>
                      <p className={`${mutedText} mt-0.5`}>
                        Policy ID: <span className="font-mono">{p.policyId ?? p.id}</span>
                      </p>
                      <p className={`${mutedText} mt-0.5`}>
                        Status: <span className="font-medium">{p.status}</span>
                      </p>
                    </div>
                    {hasUpcoming && (
                      <div className="text-right">
                        <p className="text-sm">Next Due</p>
                        <p className="font-medium">{formatDate(p._nextDueDate)}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-md ring-1 ring-borderDefault p-2">
                      <p className={`${mutedText} text-xs`}>Sum Insured</p>
                      <p className="font-medium">₹ {Number(p.sumInsured).toLocaleString()}</p>
                    </div>
                    <div className="rounded-md ring-1 ring-borderDefault p-2">
                      <p className={`${mutedText} text-xs`}>Premium</p>
                      <p className="font-medium">₹ {Number(p.premium).toLocaleString()}</p>
                    </div>
                  </div>


                  <div className="mt-4 flex items-center justify-between">
                  <div className="mt-3">{badge}</div>
                    <button
                      className={payBtn}
                      onClick={() => onPayPremium(p)}
                      disabled={!hasUpcoming || p.status !== "ACTIVE"}
                      title={
                        !hasUpcoming
                          ? "No upcoming premiums for this policy."
                          : p.status !== "ACTIVE"
                          ? "Only active policies can be paid."
                          : "Pay premium"
                      }
                    >
                      Pay Premium
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default PayPremiums;
