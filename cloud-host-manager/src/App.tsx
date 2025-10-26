import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Hosts from './pages/Hosts';
import Changes from './pages/Changes';
import Inefficient from './pages/Inefficient';
import PublicPool from './pages/PublicPool';
import Metrics from './pages/Metrics';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}> 
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hosts" element={<Hosts />} />
          <Route path="changes" element={<Changes />} />
          <Route path="inefficient" element={<Inefficient />} />
          <Route path="public-pool" element={<PublicPool />} />
          <Route path="metrics" element={<Metrics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
