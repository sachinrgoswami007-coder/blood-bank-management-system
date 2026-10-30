import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DonorRegisterPage from './pages/DonorRegisterPage';
import HospitalRegisterPage from './pages/HospitalRegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/donor" element={<DonorRegisterPage />} />
          <Route path="/register/hospital" element={<HospitalRegisterPage />} />

          {/* Role Protected Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['DONOR', 'ADMIN']} />}>
            <Route path="/donor" element={<DonorDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['HOSPITAL', 'ADMIN']} />}>
            <Route path="/hospital" element={<HospitalDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
