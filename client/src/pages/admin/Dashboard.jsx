import React from 'react';
import { useGetDashboardStatsQuery } from '../../features/adminApi';
import InfinityLoader from '../../components/InfinityLoader';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Avatar,
  IconButton,
  Button,
} from '@mui/material';
import {
  School as StudentIcon,
  People as FacultyIcon,
  AttachMoney as RevenueIcon,
  TrendingUp as DuesIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

function Dashboard() {
  const { data, isLoading, error, refetch } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: 60000, // Poll every minute to keep dynamic stats up to date
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <InfinityLoader size={100} text="Loading Dashboard Metrics..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 3, mb: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Failed to load dashboard metrics. {error.data?.message || 'Please check your connection.'}
        </Alert>
      </Box>
    );
  }

  const { stats, enrollmentStats = [], recentActivities = [] } = data || {};

  // Formatter for currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const kpis = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: <StudentIcon sx={{ fontSize: 28 }} />,
      color: '#0ea5e9',
      bg: 'rgba(14, 165, 233, 0.08)',
    },
    {
      title: 'Total Faculty',
      value: stats?.totalFaculty || 0,
      icon: <FacultyIcon sx={{ fontSize: 28 }} />,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.08)',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: <RevenueIcon sx={{ fontSize: 28 }} />,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.08)',
    },
    {
      title: 'Pending Dues',
      value: formatCurrency(stats?.pendingDues || 0),
      icon: <DuesIcon sx={{ fontSize: 28 }} />,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.08)',
    },
  ];

  // Chart color palette
  const colors = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6'];

  return (
    <Box sx={{ flexGrow: 1, py: 1 }}>
      {/* Top Header Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Analytics Overview
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
            Here is what's happening at your institution today.
          </Typography>
        </Box>
        <IconButton onClick={refetch} sx={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { backgroundColor: '#f1f5f9' } }}>
          <RefreshIcon sx={{ color: '#64748b' }} />
        </IconButton>
      </Box>

      {/* KPI Cards Row */}
      <Grid container spacing={3} mb={4}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.02), 0px 4px 12px rgba(0, 0, 0, 0.03)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.04), 0px 2px 6px rgba(0, 0, 0, 0.02)',
                },
              }}
            >
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                      {kpi.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mt: 1, letterSpacing: '-1px' }}>
                      {kpi.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: kpi.bg, color: kpi.color, width: 54, height: 54, borderRadius: 3 }}>
                    {kpi.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts & Actions Section */}
      <Grid container spacing={3}>
        {/* Chart Column */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', p: 3, boxShadow: '0px 1px 3px rgba(0,0,0,0.02)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
              Enrollment by Department
            </Typography>
            <Box sx={{ width: '100%', height: 320 }}>
              {enrollmentStats.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    No student enrollment data registered yet.
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{ fill: 'rgba(14, 165, 233, 0.04)' }}
                    />
                    <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={45}>
                      {enrollmentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Recent Activity Column */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', p: 3, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0px 1px 3px rgba(0,0,0,0.02)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Recent Activities
              </Typography>
            </Box>

            <TableContainer component={Box} sx={{ flexGrow: 1, overflow: 'auto' }}>
              <Table size="small" aria-label="recent activities table">
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow
                      key={activity._id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '& td': { py: 2, borderBottom: '1px solid #f1f5f9' },
                      }}
                    >
                      <TableCell sx={{ pl: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#0ea5e9' }}>
                          {activity.action}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#475569', mt: 0.5 }}>
                          {activity.description}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
                          {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(activity.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
export { Dashboard };
