import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputBase,
  IconButton,
  Select,
  FormControl,
  MenuItem,
} from '@mui/material';
import {
  PeopleAlt as UsersIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  DateRange as ScheduleIcon,
  AttachMoney as FeesIcon,
  TrendingUp as PerformanceIcon,
  AssignmentTurnedIn as CompleteIcon,
  LibraryBooks as BooksIcon,
  NotificationsActive as NotificationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Domain as DeptIcon,
  WorkHistory as ExpIcon,
  EventAvailable as DateIcon,
  Opacity as BloodIcon,
  Badge as BadgeIcon,
  Search as SearchIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  Translate as LangIcon,
  Notifications as NotificationBellIcon,
  VolumeUp as NewsIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (user && (user.role === 'admin' || user.role === 'super_admin')) {
    return <Navigate to="/admin" replace />;
  }

  const [selectedSemester, setSelectedSemester] = useState('Odd Semester of Academic Year 2026-2027');
  const [selectedDate, setSelectedDate] = useState('23-Jul-2026 (Thu)');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  // Custom visual components based on roles
  const renderAdminDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #ef4444' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)' }}>
              <UsersIcon sx={{ color: '#ef4444', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Total Users</Typography>
              <Typography variant="h5" fontWeight={700}>1,248</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #10b981' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)' }}>
              <ClassIcon sx={{ color: '#10b981', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Active Courses</Typography>
              <Typography variant="h5" fontWeight={700}>42</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #f59e0b' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.1)' }}>
              <FeesIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Fees Collected</Typography>
              <Typography variant="h5" fontWeight={700}>$45,280</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #4f46e5' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(79, 70, 229, 0.1)' }}>
              <CompleteIcon sx={{ color: '#4f46e5', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" fontWeight={600}>System Status</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#10b981' }}>Healthy</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card sx={{ minHeight: 300 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>System Operations Log</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Overview of recent administrator activities.
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Database backup completed successfully" secondary="Today at 6:00 AM" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Created new course: Data Structures CS-201" secondary="Yesterday" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Modified permissions for Accounts user accounts@erp.com" secondary="2 days ago" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ minHeight: 300 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>Role Distribution</Typography>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={600}>Students</Typography>
                  <Typography variant="body2" color="textSecondary">82% (1,024)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={82} sx={{ height: 8, borderRadius: 4, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#4f46e5' } }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={600}>Faculty</Typography>
                  <Typography variant="body2" color="textSecondary">12% (150)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={12} sx={{ height: 8, borderRadius: 4, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={600}>Administrative Staff</Typography>
                  <Typography variant="body2" color="textSecondary">6% (74)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={6} sx={{ height: 8, borderRadius: 4, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderFacultyDashboard = () => (
    <Box sx={{ flexGrow: 1 }}>
      {/* Institutional Top Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          border: '1px solid #e2e8f0',
          borderRadius: 3,
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SchoolIcon sx={{ color: '#4f46e5', fontSize: 32 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: '#1e293b',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              letterSpacing: -0.5,
            }}
          >
            COLLEGE NAME HERE
          </Typography>
        </Box>
        
        {/* Semester Selection */}
        <FormControl size="small" sx={{ minWidth: 320 }}>
          <Select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            sx={{
              borderRadius: 2,
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: '#f8fafc',
            }}
          >
            <MenuItem value="Odd Semester of Academic Year 2026-2027">
              AT: Odd Semester of Academic Year 2026-2027
            </MenuItem>
            <MenuItem value="Even Semester of Academic Year 2025-2026">
              AT: Even Semester of Academic Year 2025-2026
            </MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Main Grid Layout */}
      <Grid container spacing={3}>
        {/* Left Column - Profile Card */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid #e2e8f0',
              borderRadius: 3,
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Initials Avatar */}
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: '#1e293b',
                fontSize: '2.2rem',
                fontWeight: 700,
                mb: 2,
              }}
            >
              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </Avatar>

            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', textAlign: 'center', mb: 0.5 }}>
              {user.name.toUpperCase()}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 2.5 }}>
              WEB DEVELOPER / INTERNAL FACULTY
            </Typography>

            <Divider sx={{ width: '100%', mb: 2 }} />

            {/* Profile fields list */}
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <PhoneIcon sx={{ color: '#64748b', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.8rem' }}>
                  +91 9360410038
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <EmailIcon sx={{ color: '#64748b', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <DeptIcon sx={{ color: '#64748b', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.8rem' }}>
                  Dept: Administrative Office
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <ExpIcon sx={{ color: '#64748b', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.8rem' }}>
                  0 yrs, 6 months, 4 days
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <DateIcon sx={{ color: '#64748b', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.8rem' }}>
                  19-01-2026
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <BloodIcon sx={{ color: '#ef4444', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.8rem' }}>
                  A+
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <BadgeIcon sx={{ color: '#64748b', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.8rem' }}>
                  25EMP299
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ width: '100%', my: 2 }} />

            {/* Current Courses List */}
            <Box sx={{ width: '100%', textAlign: 'left' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, display: 'block', fontSize: '0.75rem', letterSpacing: 0.3 }}>
                CURRENT COURSES
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', pl: 1, fontSize: '0.8rem' }}>
                • CS-302: Algorithms
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', pl: 1, mt: 0.5, fontSize: '0.8rem' }}>
                • CS-405: Artificial Intelligence
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Flash news, stats cards, notifications table */}
        <Grid item xs={12} md={8} lg={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Flash News Banner */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(79, 70, 229, 0.04)',
                border: '1px solid rgba(79, 70, 229, 0.12)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  bgcolor: '#312e81',
                  color: '#ffffff',
                  px: 3,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  letterSpacing: 0.5,
                  clipPath: 'polygon(0 0, 90% 0, 100% 100%, 0% 100%)',
                  pr: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                <NewsIcon sx={{ fontSize: 14 }} />
                Flash News
              </Box>
              <Box sx={{ px: 2, flexGrow: 1, overflow: 'hidden' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#312e81',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Welcome to the EASA Autonomous portal. Odd semester registration for academic year 2026-2027 is active.
                </Typography>
              </Box>
            </Box>

            {/* Row of 4 Metric Cards */}
            <Grid container spacing={2}>
              {/* Card 1: Current Courses */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: '#8b5cf6', // Indigo/Purple
                    color: '#ffffff',
                    p: 2.5,
                    minHeight: 130,
                    borderRadius: 3,
                    boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8rem', opacity: 0.9 }}>
                    Current Courses
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 2 }}>
                    2
                  </Typography>
                </Card>
              </Grid>

              {/* Card 2: Result % */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: '#ec4899', // Pink
                    color: '#ffffff',
                    p: 2.5,
                    minHeight: 130,
                    borderRadius: 3,
                    boxShadow: '0 4px 14px 0 rgba(236, 72, 153, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8rem', opacity: 0.9 }}>
                    Result % (Average)
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 2 }}>
                    84.5
                  </Typography>
                </Card>
              </Grid>

              {/* Card 3: Library Books */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: '#0ea5e9', // Teal/Sky-blue
                    color: '#ffffff',
                    p: 2,
                    minHeight: 130,
                    borderRadius: 3,
                    boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8rem', opacity: 0.9 }}>
                      Library Books
                    </Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', flexDirection: 'column', gap: 0.1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', fontSize: '0.7rem', opacity: 0.85 }}>
                        Issued : 0
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', fontSize: '0.7rem', opacity: 0.85 }}>
                        Returned: 0
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', fontSize: '0.7rem', opacity: 0.85 }}>
                        Yet To Return: 0
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
                    0
                  </Typography>
                </Card>
              </Grid>

              {/* Card 4: Publications */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: '#a855f7', // Purple/Violet
                    color: '#ffffff',
                    p: 2,
                    minHeight: 130,
                    borderRadius: 3,
                    boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8rem', opacity: 0.9 }}>
                      Publications
                    </Typography>
                    <Box sx={{ mt: 0.8, display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', fontSize: '0.7rem', opacity: 0.85 }}>
                        Articles: 0
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', fontSize: '0.7rem', opacity: 0.85 }}>
                        Books: 0
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
                    0
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* e-Notifications Table Card */}
            <Card variant="outlined" sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.85rem', letterSpacing: 0.5 }}>
                    e-NOTIFICATIONS
                  </Typography>

                  {/* Search Bar */}
                  <Paper
                    component="form"
                    elevation={0}
                    sx={{
                      p: '2px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      width: 240,
                      border: '1px solid #e2e8f0',
                      borderRadius: 1.5,
                      backgroundColor: '#f8fafc',
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1, fontSize: '0.75rem', fontWeight: 600 }}
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <IconButton type="button" sx={{ p: '4px' }}>
                      <SearchIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                    </IconButton>
                  </Paper>
                </Box>

                {/* Notifications Table */}
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                      <TableRow>
                        {[
                          'ID',
                          'Module',
                          'Work Flow Type',
                          'Title',
                          'Reported By',
                          'Assigned To',
                          'Priority',
                          'Status',
                          'Updated By',
                          'Created Date',
                          'Last Updated Date',
                        ].map((col) => (
                          <TableCell
                            key={col}
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              color: '#64748b',
                              py: 1.2,
                              whiteSpace: 'nowrap',
                              borderBottom: '1px solid #e2e8f0',
                            }}
                          >
                            {col}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={11} align="center" sx={{ py: 6, color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>
                          No data available in table
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.7rem' }}>
                    Showing 0 to 0 of 0 entries
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Bottom Section - Date Slider Slider */}
            <Paper
              elevation={0}
              sx={{
                p: 1.8,
                border: '1px solid #e2e8f0',
                borderRadius: 2.5,
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2.5,
              }}
            >
              <IconButton
                size="small"
                sx={{ border: '1px solid #cbd5e1', borderRadius: 1.5, p: 0.6 }}
                onClick={() => setSelectedDate('22-Jul-2026 (Wed)')}
              >
                <PrevIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', minWidth: 140, textAlign: 'center', fontSize: '0.8rem' }}>
                {selectedDate}
              </Typography>
              <IconButton
                size="small"
                sx={{ border: '1px solid #cbd5e1', borderRadius: 1.5, p: 0.6 }}
                onClick={() => setSelectedDate('24-Jul-2026 (Fri)')}
              >
                <NextIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Paper>

          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const renderStudentDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #4f46e5' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(79, 70, 229, 0.1)' }}>
              <PerformanceIcon sx={{ color: '#4f46e5', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Current CGPA</Typography>
              <Typography variant="h5" fontWeight={700}>8.64 / 10</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #10b981' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)' }}>
              <CompleteIcon sx={{ color: '#10b981', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Attendance</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#10b981' }}>84.2%</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #ef4444' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)' }}>
              <FeesIcon sx={{ color: '#ef4444', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Pending Fees</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#ef4444' }}>$350.00</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #f59e0b' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.1)' }}>
              <BooksIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Borrowed Books</Typography>
              <Typography variant="h5" fontWeight={700}>2</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={7}>
        <Card sx={{ minHeight: 280 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>Today's Timetable</Typography>
            <List>
              <ListItem>
                <ListItemIcon><ScheduleIcon sx={{ color: '#4f46e5' }} /></ListItemIcon>
                <ListItemText primary="CS-302: Design & Analysis of Algorithms" secondary="11:30 AM - 01:00 PM - Dr. John Doe" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon><ScheduleIcon sx={{ color: '#4f46e5' }} /></ListItemIcon>
                <ListItemText primary="CS-305: Database Management Systems" secondary="02:00 PM - 03:30 PM - Prof. Alan Turing" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card sx={{ minHeight: 280 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>Attendance Summary</Typography>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 2.5 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={600}>Design & Analysis of Algorithms</Typography>
                  <Typography variant="body2" color="textSecondary">88%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={88} sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
              </Box>
              <Box sx={{ mb: 2.5 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={600}>Database Management Systems</Typography>
                  <Typography variant="body2" color="textSecondary">72% (Critical)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={72} sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#ef4444' } }} />
              </Box>
              <Box sx={{ mb: 2.5 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={600}>Computer Networks</Typography>
                  <Typography variant="body2" color="textSecondary">92%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={92} sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAccountsDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ borderLeft: '4px solid #10b981' }}>
          <CardContent>
            <Typography variant="body2" color="textSecondary" fontWeight={600}>Collections (This Month)</Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>$186,450</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>+14% increase from last month</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ borderLeft: '4px solid #ef4444' }}>
          <CardContent>
            <Typography variant="body2" color="textSecondary" fontWeight={600}>Outstanding Fees / Balance</Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>$24,800</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>42 students with pending balances</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ borderLeft: '4px solid #4f46e5' }}>
          <CardContent>
            <Typography variant="body2" color="textSecondary" fontWeight={600}>Processed Transactions</Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>1,120</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>98% success rate (Stripe/Razorpay)</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>Recent Ledger Entries</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Tuition Fee Payment received - #TXN-9841" secondary="$1,200.00 from Jane Smith - 10 mins ago" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Hostel Fee Payment received - #TXN-9840" secondary="$450.00 from Bob Ross - 1 hr ago" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Refund issued - #RFD-102" secondary="$150.00 to John Doe - 4 hrs ago" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>Quick Actions</Typography>
            <List>
              <ListItem button sx={{ bgcolor: 'rgba(79, 70, 229, 0.05)', borderRadius: 2, mb: 1 }}>
                <ListItemText primary="Generate Monthly Report" />
              </ListItem>
              <ListItem button sx={{ bgcolor: 'rgba(79, 70, 229, 0.05)', borderRadius: 2, mb: 1 }}>
                <ListItemText primary="Send Pending Dues Reminders" />
              </ListItem>
              <ListItem button sx={{ bgcolor: 'rgba(79, 70, 229, 0.05)', borderRadius: 2 }}>
                <ListItemText primary="Update Fee Categories" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      {/* Welcome Banner */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%)', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
        <Typography variant="h4" fontWeight={800} color="#0f172a" sx={{ mb: 1, letterSpacing: -0.5 }}>
          Welcome back, {user.name}!
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
          Here is what's happening today in your {user.role} workspace.
        </Typography>
      </Box>

      {/* Conditional Dashboard Rendering */}
      {(user.role === 'admin' || user.role === 'super_admin') && renderAdminDashboard()}
      {(user.role === 'faculty' || user.role === 'hod') && renderFacultyDashboard()}
      {user.role === 'student' && renderStudentDashboard()}
      {(user.role === 'accounts' || user.role === 'accountant') && renderAccountsDashboard()}
    </Box>
  );
};

export default Dashboard;
export { Dashboard };
