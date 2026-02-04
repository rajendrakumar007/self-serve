import StatusBadge from "./StatusCard";

export default function PaymentCard({ payment }) {
  const { paymentId, amount, paymentDate, status, method, type } = payment;

  // Basic amount formatter (assumes amount is a normal unit value, not cents)
  const currency = "INR";
  const formattedAmount = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);

  return (
    <div
      className="rounded-card shadow-sm p-5
                 bg-bgCard dark:bg-gray-800 text-textPrimary dark:text-textInverted
                 border border-borderDefault dark:border-gray-700
                 hover:shadow-lg transition"
    >
      {/* Top row: Amount + Status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-textPrimary dark:text-textInverted">
            Amount
          </p>
          <p className="text-xl font-bold text-textPrimary dark:text-textInverted">
            {formattedAmount}
          </p>
          {/* currency && ( */}

          <p className="text-xs text-textPrimary dark:text-textInverted mt-0.5">
            Currency: {"INR"}
          </p>
        </div>

        <span>
          <StatusBadge status={status} />
        </span>
      </div>

      {/* Divider */}
      <hr className="my-4 border-borderDefault dark:border-gray-700" />

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-textPrimary dark:text-textInverted">
            Payment ID
          </p>
          <p className="font-medium break-all text-textPrimary dark:text-textInverted">
            {paymentId}
          </p>
        </div>
        <div>
          <p className="text-xs text-textPrimary dark:text-textInverted">
            Method
          </p>
          <p className="font-medium text-textPrimary dark:text-textInverted">
            {method.toUpperCase()}
          </p>
        </div>
        {paymentDate && (
          <div>
            <p className="text-xs text-textPrimary dark:text-textInverted">
              Date
            </p>
            <p className="font-medium text-textPrimary dark:text-textInverted">
              {paymentDate}
            </p>
          </div>
        )}
        {type && (
          <div>
            <p className="text-xs text-textPrimary dark:text-textInverted">
              Type
            </p>
            <p className="font-medium text-textPrimary dark:text-textInverted">
              {type}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
