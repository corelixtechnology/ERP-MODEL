import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import theme from './theme';
import { loadUser } from './features/authSlice';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import InfinityLoader from './components/InfinityLoader';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCourses from './pages/admin/Courses';
import AdminSettings from './pages/admin/Settings';

import StudentFees from './pages/student/Fees';
import StudentAttendance from './pages/student/Attendance';
import StudentResults from './pages/student/Results';
import StudentLibrary from './pages/student/Library';
import FacultyAttendance from './pages/faculty/Attendance';
import AccountsFees from './pages/accounts/Fees';
import AccountsTransactions from './pages/accounts/Transactions';

const FacultyCourses = () => <Box sx={{ p: 2 }}><Typography variant="h5">Assigned Courses Panel</Typography></Box>;
const FacultyGrades = () => <Box sx={{ p: 2 }}><Typography variant="h5">Grade Spreadsheet Registry</Typography></Box>;

const AccountsReports = () => <Box sx={{ p: 2 }}><Typography variant="h5">Financial Analytical Ledger Reports</Typography></Box>;

import { Typography } from '@mui/material';

function AppContent() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: '#f8fafc' }}
      >
        <InfinityLoader size={120} text="Loading College ERP..." />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes Wrapper */}
      <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admin', 'admission_officer', 'hod', 'faculty', 'student', 'parent', 'accountant', 'accounts', 'librarian', 'hostel_warden', 'transport_manager', 'placement_officer', 'hr', 'exam_cell', 'reception']} />}>
        
        {/* Admin Routes with custom layout */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Layout Shell Wrapper */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Faculty Routes */}
          <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
            <Route path="/faculty/courses" element={<FacultyCourses />} />
            <Route path="/faculty/attendance" element={<FacultyAttendance />} />
            <Route path="/faculty/grades" element={<FacultyGrades />} />
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'parent', 'accountant', 'accounts', 'admin', 'super_admin']} />}>
            <Route path="/student/attendance" element={<StudentAttendance />} />
            <Route path="/student/results" element={<StudentResults />} />
            <Route path="/student/fees" element={<StudentFees />} />
            <Route path="/student/library" element={<StudentLibrary />} />
          </Route>

          {/* Accounts Routes */}
          <Route element={<ProtectedRoute allowedRoles={['accounts', 'accountant', 'admin', 'super_admin']} />}>
            <Route path="/accounts/transactions" element={<AccountsTransactions />} />
            <Route path="/accounts/fees" element={<AccountsFees />} />
            <Route path="/accounts/reports" element={<AccountsReports />} />
          </Route>
        </Route>
      </Route>

      {/* Fallbacks */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

// App bundle export with full student & accounts fee routes (Redesigned Attendance UI)
export default App;
