import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/Authentication/Login";
import SignUp from "./pages/authentication/SignUp";
import ForgotPassword from "./Pages/Authentication/ForgotPassword";
import Home from "./pages/authentication/Home";
import About from "./pages/authentication/About";

import PaymentDetails from "./pages/payments/PaymentDetails";
import PaymentHistory from "./Pages/Payments/PaymentHistory";
import RenewalDetails from "./components/payments/RenewalDetails";

import StoryPage from "./pages/story/Story";
import NotFound from "./pages/authentication/NotFound";
import PaymentSuccess from "./Pages/Payments/PaymentSuccess";
import PaymentFailure from "./pages/payments/PaymentFailure";
import PolicyPage from "./Pages/Policies/PolicyPage";
import PolicyList from "./pages/policpages/PolicyList";

import PolicyDetails from "./pages/policpages/PolicyDetails";
import ProtectedRoute from "./routes/ProtectedRoute";

import PayPremiums from "./pages/payments/PayPremiums";
import Checkout from "./components/payments/Checkout";

import Profile from "./Pages/Authentication/ProfilePage";
import SupportPage from "./Pages/support/SupportPage";
import ResetPassword from "./pages/authentication/ResetPassword";

import ExpectedTimelines from "./pages/claims/ExpectedTimelines";
import SubmitClaimForm from "./pages/claims/SubmitClaimForm";
import TrackClaims from "./pages/claims/TrackClaims";

import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import RefundPolicy from "./pages/legal/RefundPolicy";

import AdminClaims from "./components/admin/Claims";
import AdminTickets from "./components/admin/Tickets";

function App() {

  return (
    <>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        <Route path="/admin/claims" element={<AdminClaims/>} />
        <Route path="/admin/tickets" element={<AdminTickets/>} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset" element={<ResetPassword />} />

        <Route path="/policies/:type" element={<PolicyPage />} />
        <Route element={<ProtectedRoute />} >
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/check-policy" element={<PolicyList />} />
          <Route path="/check-policy/:id" element={<PolicyDetails />} />


          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pay-premiums" element={<PayPremiums />} />
          <Route path="/payments" element={<PaymentDetails />} />
          <Route path="/renewals" element={<RenewalDetails />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="/payment-history" element={<PaymentHistory />} />


          <Route path="/submit-claim" element={<SubmitClaimForm />} />
          <Route path="/track-claims" element={<TrackClaims />} />
        </Route>
          <Route path="/guide-lines" element={<ExpectedTimelines />} />

        <Route path="/support" element={<SupportPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;






