import React from "react";
import { Routes, Route /*, BrowserRouter */ } from "react-router-dom";

import Login from "./Pages/Authentication/Login";
import SignUp from "./Pages/Authentication/SignUp";
import ForgotPassword from "./Pages/Authentication/ForgotPassword";
import ProfilePage from "./Pages/Authentication/ProfilePage";
import Home from "./Pages/Authentication/Home";
import AuthLanding from "./Pages/Authentication/AuthLanding";
import About from "./Pages/Authentication/About";

// Keep all policy pages under the same folder & casing
import CarPolicies from "./Pages/Policies/Car";
import BikePolicies from "./Pages/Policies/Bike";
import HealthPolicies from "./Pages/Policies/Health";
import LifePolicies from "./Pages/Policies/Life";
import TravelPolicies from "./Pages/Policies/Travel";
import AirPassPolicies from "./Pages/Policies/AirPass";

import StoryPage from "./Pages/Story/story";

function App() {

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/story" element={<StoryPage />} />

      {/* Auth */}
      <Route path="/auth" element={<AuthLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Policies — use URL paths, not file paths */}
      <Route path="/policies/car" element={<CarPolicies />} />
      <Route path="/policies/bike" element={<BikePolicies />} />
      <Route path="/policies/health" element={<HealthPolicies />} />
      <Route path="/policies/life" element={<LifePolicies />} />
      <Route path="/policies/travel" element={<TravelPolicies />} />
      <Route path="/policies/airpass" element={<AirPassPolicies />} />
    </Routes>
  );
}

export default App;
