
import { Routes, Route, Navigate } from 'react-router-dom';
import PolicyList from './pages/PolicyList.jsx';
import PolicyDetails from './pages/PolicyDetails.jsx';

export default function App() {
  return (
    <div className="container py-3">
      <header className="mb-4">
        <h1 className="h4">SelfServe – Display Policies</h1>
        <p className="text-muted">Sprint-1: UI + fake API using json-server</p>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/policies" replace />} />
        <Route path="/policies" element={<PolicyList />} />
        <Route path="/policies/:id" element={<PolicyDetails />} />
      </Routes>
    </div>
  );
}
