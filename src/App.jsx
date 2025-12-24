import React from "react";
import Login from "./Pages/Authentication/Login";
import SignUp from "./Pages/Authentication/SignUp";
import ForgotPassword from "./Pages/Authentication/ForgotPassword";
import ProfilePage from "./Pages/Authentication/ProfilePage";
import Home from "./Pages/Authentication/Home";
import { Routes, Route } from "react-router-dom";
import About from "./Pages/Authentication/About";

function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>

    
  
  )
 
}

export default App;
