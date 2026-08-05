import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/authSlice';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Book as BookIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  School as SchoolIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';

const expandedDrawerWidth = 260;
const collapsedDrawerWidth = 72;

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isExpanded = !isCollapsed || isHovered;
  const currentDrawerWidth = isExpanded ? expandedDrawerWidth : collapsedDrawerWidth;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await dispatch(logoutUser());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Course Management', icon: <BookIcon />, path: '/admin/courses' },
    { text: 'Fee Management', icon: <PaymentIcon />, path: '/accounts/fees' },
    { text: 'System Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: '#ffffff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Brand & Logo Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'space-between' : 'center',
          px: isExpanded ? 2.5 : 1,
          py: 2.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
              flexShrink: 0,
            }}
          >
            <SchoolIcon sx={{ color: '#ffffff', fontSize: 24 }} />
          </Box>
          {isExpanded && (
            <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                }}
              >
                EduERP
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#0ea5e9',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                }}
              >
                Admin Suite
              </Typography>
            </Box>
          )}
        </Box>

        {/* Desktop Pin/Collapse Button */}
        {isExpanded && (
          <IconButton
            onClick={handleCollapseToggle}
            size="small"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              display: { xs: 'none', sm: 'flex' },
              '&:hover': { color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.08)' },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* User Profile Summary Card */}
      <Box
        sx={{
          mx: isExpanded ? 2 : 1,
          mt: 2,
          mb: 1,
          p: isExpanded ? 1.5 : 1,
          borderRadius: '14px',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          justifyContent: isExpanded ? 'initial' : 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#10b981',
              color: '#10b981',
              boxShadow: '0 0 0 2px #0f172a',
              width: 10,
              height: 10,
              borderRadius: '50%',
            },
          }}
        >
          <Avatar
            alt={user?.name}
            src={user?.profilePic}
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#ef4444',
              fontSize: '0.85rem',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
            }}
          >
            {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'A'}
          </Avatar>
        </Badge>
        {isExpanded && (
          <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
            <Typography variant="subtitle2" noWrap sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem' }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: '0.68rem', fontWeight: 600 }}>
              {user?.role ? user.role.toUpperCase().replace('_', ' ') : 'ADMINISTRATOR'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation Group Header */}
      {isExpanded && (
        <Typography
          variant="caption"
          sx={{
            px: 3,
            pt: 2,
            pb: 1,
            display: 'block',
            color: 'rgba(255, 255, 255, 0.35)',
            fontWeight: 800,
            letterSpacing: '1.5px',
            fontSize: '0.65rem',
          }}
        >
          NAVIGATION
        </Typography>
      )}

      {/* Navigation List */}
      <Box sx={{ flexGrow: 1, px: isExpanded ? 2 : 1, py: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {menuItems.map((item) => {
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin' || location.pathname === '/admin/'
                : location.pathname.startsWith(item.path);

            const listItemBtn = (
              <ListItemButton
                component={NavLink}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setMobileOpen(false)}
                sx={{
                  minHeight: 46,
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.18) 0%, rgba(99, 102, 241, 0.1) 100%)' : 'transparent',
                  background: isActive ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.18) 0%, rgba(99, 102, 241, 0.1) 100%)' : 'transparent',
                  color: isActive ? '#38bdf8' : 'rgba(241, 245, 249, 0.7)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  px: isExpanded ? 2 : 1.5,
                  justifyContent: isExpanded ? 'initial' : 'center',
                  borderLeft: isActive ? '4px solid #38bdf8' : '4px solid transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(14, 165, 233, 0.15)' : 'none',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(14, 165, 233, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    color: '#ffffff',
                    transform: 'translateX(2px)',
                    '& .MuiListItemIcon-root': { color: '#38bdf8' },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.5)',
                    minWidth: isExpanded ? 36 : 0,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isExpanded && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '-0.2px',
                    }}
                  />
                )}
              </ListItemButton>
            );

            return (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                {!isExpanded ? (
                  <Tooltip title={item.text} placement="right" arrow>
                    {listItemBtn}
                  </Tooltip>
                ) : (
                  listItemBtn
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Expand Toggle Button when Collapsed */}
      {!isExpanded && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          <IconButton
            onClick={handleCollapseToggle}
            size="small"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              '&:hover': { color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box sx={{ px: isExpanded ? 2.5 : 1.5, my: 1 }}>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
      </Box>

      {/* Sign Out Button */}
      <Box sx={{ p: isExpanded ? 2 : 1 }}>
        {!isExpanded ? (
          <Tooltip title="Sign Out" placement="right" arrow>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '12px',
                color: 'rgba(241, 245, 249, 0.7)',
                justifyContent: 'center',
                minHeight: 46,
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  '& .MuiListItemIcon-root': { color: '#ef4444' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', minWidth: 0, justifyContent: 'center' }}>
                <LogoutIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ) : (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '12px',
              color: 'rgba(241, 245, 249, 0.7)',
              transition: 'all 0.15s ease-in-out',
              px: 2,
              minHeight: 46,
              border: '1px solid rgba(239, 68, 68, 0.2)',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                '& .MuiListItemIcon-root': { color: '#ef4444' },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(239, 68, 68, 0.7)', minWidth: 36, justifyContent: 'center' }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 700 }}
            />
          </ListItemButton>
        )}
      </Box>
    </Box>
  );

  const drawerPaperStyles = {
    boxSizing: 'border-box',
    width: currentDrawerWidth,
    background: 'linear-gradient(180deg, #0b0f19 0%, #0f172a 60%, #020617 100%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.07)',
    boxShadow: isExpanded ? '10px 0 40px rgba(0, 0, 0, 0.4)' : '4px 0 20px rgba(0, 0, 0, 0.2)',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
    overflowX: 'hidden',
  };

  const activeHeaderTitle =
    menuItems.find((item) => {
      if (item.path === '/admin') {
        return location.pathname === '/admin' || location.pathname === '/admin/';
      }
      return location.pathname.startsWith(item.path);
    })?.text || 'Admin Dashboard';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          color: '#0f172a',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, minHeight: 64 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>
              {activeHeaderTitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#0ea5e9', bgcolor: 'rgba(14, 165, 233, 0.08)' } }}>
              <Badge badgeContent={3} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: '#0ea5e9' } }}>
                <NotificationIcon fontSize="small" />
              </Badge>
            </IconButton>

            {user && (
              <Chip
                label={user.role ? user.role.toUpperCase().replace('_', ' ') : 'ADMIN'}
                color="error"
                size="small"
                sx={{ fontWeight: 800, letterSpacing: 0.5, px: 0.5, fontSize: '0.7rem' }}
              />
            )}

            <Tooltip title="Account settings">
              <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0.5 }}>
                <Avatar
                  alt={user?.name}
                  src={user?.profilePic}
                  sx={{ width: 36, height: 36, bgcolor: '#ef4444', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.12))',
                  mt: 1.5,
                  borderRadius: 3,
                  minWidth: 200,
                  border: '1px solid #e2e8f0',
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => navigate('/admin')}>Admin Dashboard</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1, color: '#ef4444' }} />
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar navigation"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': drawerPaperStyles,
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          PaperProps={{
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
          }}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': drawerPaperStyles,
            width: currentDrawerWidth,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: 0 },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLayout;
export { AdminLayout };
