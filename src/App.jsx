
// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PolicyList from "./Pages/PolicyList.jsx";
import PolicyDetails from "./Pages/PolicyDetails.jsx";

function App() {
  return (
    <div className="container py-3">
      <header className="mb-4">
        <h1 className="h4">SelfServe – Display Policies</h1>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/policies" replace />} />
        <Route path="/policies" element={<PolicyList />} />
        <Route path="/policies/:id" element={<PolicyDetails />} />
      </Routes>
    </div>
  );
}

export default App;
