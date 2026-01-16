import StatusBadge from "./StatusCard";

export default function PaymentCard({ payment}) {
  const {
    paymentId,
    amount,
    paymentDate,
    status,
    method,
    type
  } = payment;

  // Basic amount formatter (assumes amount is a normal unit value, not cents)
  const currency = "INR";
  const formattedAmount = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);

  return (
    <div
      className="rounded-card shadow-sm p-5
                 bg-bgCard text-textPrimary
                 border border-borderDefault
                 dark:bg-secondary dark:text-textInverted
                 hover:shadow-lg transition"
    >
      {/* Top row: Amount + Status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-textMuted dark:text-textInverted/70">Amount</p>
          <p className="text-xl font-bold">{formattedAmount}</p>
          {/* currency && ( */}
          
            <p className="text-xs text-textMuted dark:text-textInverted/70 mt-0.5">
              Currency: {"INR"}
            </p>
          
        </div>

        <span >
          <StatusBadge status={status} />
        </span>
      </div>

      {/* Divider */}
      <hr className="my-4 border-borderDefault" />

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-textMuted dark:text-textInverted/70">Payment ID</p>
          <p className="font-medium break-all">{paymentId}</p>
        </div>
        <div>
          <p className="text-xs text-textMuted dark:text-textInverted/70">Method</p>
          <p className="font-medium">{method.toUpperCase()}</p>
        </div>
        {paymentDate && (
          <div>
            <p className="text-xs text-textMuted dark:text-textInverted/70">Date</p>
            <p className="font-medium">{paymentDate}</p>
          </div>
        )}
         {type && (<div>
            <p className="text-xs text-textMuted dark:text-textInverted/70">Type</p>
            <p className="font-medium">{type}</p>
          </div>)}
      </div>
    </div>
  );
}

