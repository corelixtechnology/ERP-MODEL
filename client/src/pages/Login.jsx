import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/authSlice';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  Paper,
  Card,
  CardActionArea,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  EmailOutlined as EmailIcon,
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
  AdminPanelSettingsOutlined as AdminIcon,
  PersonOutlineOutlined as StudentIcon,
  SupervisorAccountOutlined as FacultyIcon,
  AccountBalanceWalletOutlined as AccountsIcon,
} from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleQuickFill = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  const demoAccounts = [
    {
      role: 'Super Admin',
      email: 'superadmin@erp.com',
      icon: <AdminIcon sx={{ fontSize: 26, color: '#dc2626' }} />,
      bg: 'rgba(220, 38, 38, 0.05)',
      border: 'rgba(220, 38, 38, 0.15)',
      hoverBorder: '#dc2626',
      badgeColor: '#dc2626',
    },
    {
      role: 'Admin',
      email: 'admin@erp.com',
      icon: <AdminIcon sx={{ fontSize: 26, color: '#ef4444' }} />,
      bg: 'rgba(239, 68, 68, 0.05)',
      border: 'rgba(239, 68, 68, 0.15)',
      hoverBorder: '#ef4444',
      badgeColor: '#ef4444',
    },
    {
      role: 'HOD (CS)',
      email: 'hod@erp.com',
      icon: <FacultyIcon sx={{ fontSize: 26, color: '#8b5cf6' }} />,
      bg: 'rgba(139, 92, 246, 0.05)',
      border: 'rgba(139, 92, 246, 0.15)',
      hoverBorder: '#8b5cf6',
      badgeColor: '#8b5cf6',
    },
    {
      role: 'Faculty',
      email: 'faculty@erp.com',
      icon: <FacultyIcon sx={{ fontSize: 26, color: '#10b981' }} />,
      bg: 'rgba(16, 185, 129, 0.05)',
      border: 'rgba(16, 185, 129, 0.15)',
      hoverBorder: '#10b981',
      badgeColor: '#10b981',
    },
    {
      role: 'Student',
      email: 'student@erp.com',
      icon: <StudentIcon sx={{ fontSize: 26, color: '#4f46e5' }} />,
      bg: 'rgba(79, 70, 229, 0.05)',
      border: 'rgba(79, 70, 229, 0.15)',
      hoverBorder: '#4f46e5',
      badgeColor: '#4f46e5',
    },
    {
      role: 'Accountant',
      email: 'accountant@erp.com',
      icon: <AccountsIcon sx={{ fontSize: 26, color: '#f59e0b' }} />,
      bg: 'rgba(245, 158, 11, 0.05)',
      border: 'rgba(245, 158, 11, 0.15)',
      hoverBorder: '#f59e0b',
      badgeColor: '#f59e0b',
    },
    {
      role: 'Exam Cell',
      email: 'exam@erp.com',
      icon: <AdminIcon sx={{ fontSize: 26, color: '#0284c7' }} />,
      bg: 'rgba(2, 132, 199, 0.05)',
      border: 'rgba(2, 132, 199, 0.15)',
      hoverBorder: '#0284c7',
      badgeColor: '#0284c7',
    },
    {
      role: 'Placement',
      email: 'placement@erp.com',
      icon: <StudentIcon sx={{ fontSize: 26, color: '#ec4899' }} />,
      bg: 'rgba(236, 72, 153, 0.05)',
      border: 'rgba(236, 72, 153, 0.15)',
      hoverBorder: '#ec4899',
      badgeColor: '#ec4899',
    },
  ];

  return (
    <Grid container sx={{ minHeight: '100vh', overflow: 'hidden', bgcolor: '#f8fafc' }}>
      {/* Left Column - Hero Banner (hidden on mobile) */}
      {!isMobile && (
        <Grid
          item
          xs={false}
          md={6}
          lg={7}
          sx={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 8,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
              top: '10%',
              left: '10%',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
              bottom: '10%',
              right: '10%',
            },
          }}
        >
          {/* Decorative Floating Glass Card */}
          <Paper
            elevation={0}
            sx={{
              p: 5,
              maxWidth: 480,
              borderRadius: 5,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              transform: 'perspective(1000px) rotateY(-5deg)',
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'perspective(1000px) rotateY(0deg)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.5)',
                }}
              >
                <SchoolIcon sx={{ color: '#ffffff', fontSize: 28 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                EduERP Portal
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.1, letterSpacing: -1 }}>
              Complete Academic & Management System
            </Typography>
            <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 4, fontWeight: 400, lineHeight: 1.6 }}>
              A robust, role-based ERP designed to streamline university administrative processes, attendance, financial ledgers, and academic results tracking.
            </Typography>

            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#38bdf8' }}>100%</Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Paperless Workflow</Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#38bdf8' }}>Real-time</Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Analytics & Reports</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      )}

      {/* Right Column - Login Form */}
      <Grid
        item
        xs={12}
        md={6}
        lg={5}
        component={Paper}
        elevation={0}
        square
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 4, sm: 6, md: 8 },
          bgcolor: '#ffffff',
          position: 'relative',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
          {/* Mobile Header Logo */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
              <SchoolIcon sx={{ color: '#4f46e5', fontSize: 32 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
                EduERP Portal
              </Typography>
            </Box>
          )}

          {/* Heading */}
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, letterSpacing: -0.8 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 4, fontSize: '0.95rem' }}>
            Enter your credentials or choose a quick-fill demo account below.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontWeight: 500 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&.Mui-focused fieldset': {
                    borderColor: '#4f46e5',
                    boxShadow: '0 0 0 4px rgba(79, 70, 229, 0.1)',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
                      sx={{ color: '#94a3b8' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&.Mui-focused fieldset': {
                    borderColor: '#4f46e5',
                    boxShadow: '0 0 0 4px rgba(79, 70, 229, 0.1)',
                  },
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.8,
                borderRadius: 3,
                backgroundColor: '#4f46e5',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
                '&:hover': {
                  backgroundColor: '#3730a3',
                  boxShadow: '0 10px 15px -3px rgba(55, 48, 163, 0.4)',
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Sign In'}
            </Button>
          </form>

          {/* Quick-Fill Demo Section */}
          <Box sx={{ mt: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
              <Divider sx={{ flexGrow: 1, borderColor: '#e2e8f0' }} />
              <Typography variant="caption" sx={{ px: 2, color: '#94a3b8', fontWeight: 700, letterSpacing: 0.5 }}>
                DEMO LOGIN QUICK-TILES
              </Typography>
              <Divider sx={{ flexGrow: 1, borderColor: '#e2e8f0' }} />
            </Box>

            <Grid container spacing={2}>
              {demoAccounts.map((account) => (
                <Grid item xs={6} key={account.role}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${account.border}`,
                      bgcolor: account.bg,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: account.hoverBorder,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      },
                    }}
                  >
                    <CardActionArea onClick={() => handleQuickFill(account.email)} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            backgroundColor: '#ffffff',
                            border: '1px solid rgba(0, 0, 0, 0.03)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
                          }}
                        >
                          {account.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
                            {account.role}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>
                            {account.email}
                          </Typography>
                        </Box>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

import { Divider } from '@mui/material';

export default Login;
export { Login };
