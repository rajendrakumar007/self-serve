
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PolicyList from "./Pages/PolicyList.jsx";
import PolicyDetails from "./Pages/PolicyDetails.jsx";


function App() {
  return (
    <div className="min-h-screen bg-primaryDark text-textInverted">
      <header className="px-6 py-4">
        <h1 className="text-lg font-semibold">SelfServe – Display Policies</h1>
      </header>

      <main className="px-4 md:px-6 lg:px-10 pb-6">
        <section className="rounded-card border border-borderDefault bg-bgCard shadow-sm text-textPrimary">
          <div className="p-4 md:p-5">
            <Routes>
              <Route path="/" element={<Navigate to="/policies" replace />} />
              <Route path="/policies" element={<PolicyList />} />
              <Route path="/policies/:id" element={<PolicyDetails />} />
            </Routes>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
