
import { FaCheckCircle , FaArrowLeft } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

export default function PaymentSuccess() {

  const paymentSuccessMessages = {
    "successfullMessage": "Payment Successful",
    "thankYouMessage": "Thank you! Your transaction was completed successfully.",
    "viewMessage": "View Payment History"
  }
  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex items-center justify-center px-4
                 bg-bgBase text-textPrimary
                 dark:bg-secondary dark:text-textInverted"
      >
        <div
          className="w-full max-w-md rounded-card shadow-md p-8
                   bg-bgCard dark:bg-secondary"
        >
          {/* Icon */}
          <div className="flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center
                       bg-successBg"
            >
              <FaCheckCircle className="text-success" size={32} />
            </div>

            <h1 className="mt-4 text-2xl font-bold">{paymentSuccessMessages.successfullMessage}</h1>
            <p className="mt-2 text-textMuted dark:text-textInverted/80 text-sm">
              {paymentSuccessMessages.thankYouMessage}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <a href="/payment-history" className="text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-4 hover:underline-offset-8 transition duration-300 ease-in">{paymentSuccessMessages.viewMessage}</a>
            <a
              href="/"
              className="w-full text-center rounded-pill px-5 py-3 font-semibold
                       bg-primary text-textInverted hover:bg-primaryDark transition
         textSecondary hover:bg-bgHover transition
                       dark:bgCard" >
              Home
            </a>
          </div>
        </div>
      </div>
    </>

  );

}

