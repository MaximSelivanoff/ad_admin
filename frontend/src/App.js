import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LocaleProvider } from './contexts/LocaleContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import References from './pages/References';
import AuditLog from './pages/AuditLog';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      {!isAuthPage && <Sidebar />}
      {!isAuthPage && <Header />}
      <main className={`${!isAuthPage ? 'ml-64 pt-4' : ''}`}>{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocaleProvider>
          <AppLayout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/references"
                element={
                  <ProtectedRoute>
                    <References />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/audit"
                element={
                  <ProtectedRoute>
                    <AuditLog />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </LocaleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
