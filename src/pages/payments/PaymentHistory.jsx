import { useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import PaymentCard from "../../components/payments/PaymentCard"
import { getPayments } from "../../utils/payments/payment";
import { useState } from "react";
import { PROFILE_KEY } from "../../utils/auth/auth";

const PaymentHistory = () => {

  const [payments, setPayments] =  useState([]);
  const userObj = JSON.parse(localStorage.getItem(PROFILE_KEY));
  console.log(userObj)
  const userId = userObj?.userId;
  console.log(userId)
  useEffect(() => {
    document.title = "Payment History - InsureTech";
    const fetchPayments = async () => {
      const data = await getPayments({userId});
      setPayments(data);
    };
    fetchPayments();
  }, []);

  console.log(payments)


  
  return (
    <>
      <Navbar />
      <div
        className="min-h-screen px-4
                   bg-bgBase text-textPrimary
                   dark:bg-secondary dark:text-textInverted"
      >
        {/* Header */}
        <div className="max-w-6xl mx-auto py-6">
          <h1 className="text-xl font-semibold mb-6">Payment History</h1>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            { payments.length > 0 ? (
              payments.map((p) => (
                <PaymentCard key={p.paymentId ?? Math.random()} payment={p} />
              ))
            ) : (
              <div
                className="rounded-card p-6 bg-bgCard dark:bg-secondary
                           border border-borderDefault shadow-sm"
              >
                <p className="text-textMuted dark:text-textInverted/70">
                  No payments found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

}
export default PaymentHistory;

