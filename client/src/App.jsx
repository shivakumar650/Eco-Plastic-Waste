import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Campaigns = lazy(() => import('./pages/campaigns/Campaigns'));
const CampaignDetail = lazy(() => import('./pages/campaigns/CampaignDetail'));
const CreateCampaign = lazy(() => import('./pages/campaigns/CreateCampaign'));
const CreateResource = lazy(() => import('./pages/resources/CreateResource'));
const CreateAgency = lazy(() => import('./pages/agencies/CreateAgency'));
const Analytics = lazy(() => import('./pages/analytics/Analytics'));
const Resources = lazy(() => import('./pages/resources/Resources'));
const ResourceDetail = lazy(() => import('./pages/resources/ResourceDetail'));
const Agencies = lazy(() => import('./pages/agencies/Agencies'));
const AgencyDetail = lazy(() => import('./pages/agencies/AgencyDetail'));
const Profile = lazy(() => import('./pages/user/Profile'));
const Bookmarks = lazy(() => import('./pages/user/Bookmarks'));
const Activity = lazy(() => import('./pages/user/Activity'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminModeration = lazy(() => import('./pages/admin/AdminModeration'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'));
const About = lazy(() => import('./pages/About'));

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="campaigns" element={<Campaigns />} />
                  <Route path="campaigns/create" element={
                    <ProtectedRoute>
                      <CreateCampaign />
                    </ProtectedRoute>
                  } />
                  <Route path="campaigns/:id" element={<CampaignDetail />} />
                  <Route path="resources" element={<Resources />} />
                  <Route path="resources/create" element={
                    <ProtectedRoute>
                      <CreateResource />
                    </ProtectedRoute>
                  } />
                  <Route path="resources/:id" element={<ResourceDetail />} />
                  <Route path="agencies" element={<Agencies />} />
                  <Route path="agencies/create" element={
                    <ProtectedRoute>
                      <CreateAgency />
                    </ProtectedRoute>
                  } />
                  <Route path="agencies/:id" element={<AgencyDetail />} />
                  <Route path="about" element={<About />} />
                  
                  {/* Protected user routes */}
                  <Route path="profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="bookmarks" element={
                    <ProtectedRoute>
                      <Bookmarks />
                    </ProtectedRoute>
                  } />
                  <Route path="activity" element={
                    <ProtectedRoute>
                      <Activity />
                    </ProtectedRoute>
                  } />
                  <Route path="analytics" element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected dashboard routes */}
                  <Route path="dashboard/*" element={
                    <ProtectedRoute roles={['content_proposer', 'admin']}>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                </Route>

                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="campaigns" element={<AdminModeration type="campaign" />} />
                  <Route path="resources" element={<AdminModeration type="resource" />} />
                  <Route path="agencies" element={<AdminModeration type="agency" />} />
                  <Route path="audit-logs" element={<AdminAuditLogs />} />
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </Suspense>

              {/* Global components */}
              <Toaster
                position="top-right"
                containerStyle={{
                  top: '80px',
                }}
                toastOptions={{
                  duration: 4000,
                  className: '',
                  style: {
                    background: '#374151',
                    color: '#f9fafb',
                    border: '1px solid #4b5563',
                  },
                  success: {
                    style: {
                      background: '#065f46',
                      color: '#ecfdf5',
                      border: '1px solid #10b981',
                    },
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    style: {
                      background: '#7f1d1d',
                      color: '#fef2f2',
                      border: '1px solid #ef4444',
                    },
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;