import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SidebarLayout from './components/SidebarLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddPage from './pages/AddPage';
import EditPage from './pages/EditPage';
import PublicPage from './pages/PublicPage';
import LeadsInbox from './pages/LeadsInbox';


function App() {
  return (
    <AuthProvider>
      <div dir="rtl" className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-blue-600/30 selection:text-blue-200">
        <Router>
          <Routes>
            {/* Admin auth routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected admin management routes wrapped in Workspace Sidebar */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Dashboard />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Dashboard />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/leads"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <LeadsInbox />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/add"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <AddPage />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/edit/:id"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <EditPage />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />

            {/* Public rendering catcher */}
            <Route path="/:slug" element={<PublicPage />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
