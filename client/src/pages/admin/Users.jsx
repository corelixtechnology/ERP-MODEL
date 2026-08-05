import React, { useState } from 'react';
import InfinityLoader from '../../components/InfinityLoader';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../../features/adminApi';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

function Users() {
  // Query & Mutation States
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Fetch Users
  const { data, isLoading, isFetching, error, refetch } = useGetUsersQuery({
    page: page + 1,
    limit: pageSize,
    role: roleFilter,
    search: searchQuery,
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Form Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null means adding
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    batch: '',
    semester: 1,
    dues: 0,
  });

  // Action Messages
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  // Delete Confirmation States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Search trigger
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(0); // Reset page
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(0); // Reset page
  };

  // Open Form for Adding
  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      department: 'Computer Science',
      batch: '2023-2027',
      semester: 1,
      dues: 0,
    });
    setFormOpen(true);
  };

  // Open Form for Editing
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Optional for edit
      role: user.role,
      department: user.studentInfo?.department || 'Computer Science',
      batch: user.studentInfo?.batch || '2023-2027',
      semester: user.studentInfo?.semester || 1,
      dues: user.studentInfo?.dues || 0,
    });
    setFormOpen(true);
  };

  // Open Delete Confirmation Dialog
  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Handle Form Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'dues' || name === 'semester' ? Number(value) : value,
    }));
  };

  // Submit Add / Edit Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setAlertMsg({ type: '', text: '' });

    try {
      if (editingUser) {
        // Edit User
        const payload = {
          id: editingUser._id,
          name: formData.name,
          email: formData.email,
          isActive: editingUser.isActive,
          ...(formData.password && { password: formData.password }),
        };

        if (formData.role === 'student') {
          payload.department = formData.department;
          payload.batch = formData.batch;
          payload.semester = formData.semester;
          payload.dues = formData.dues;
        }

        await updateUser(payload).unwrap();
        setAlertMsg({ type: 'success', text: `User "${formData.name}" updated successfully!` });
      } else {
        // Add User
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        if (formData.role === 'student') {
          payload.department = formData.department;
          payload.batch = formData.batch;
          payload.semester = formData.semester;
          payload.dues = formData.dues;
        }

        await createUser(payload).unwrap();
        setAlertMsg({ type: 'success', text: `User "${formData.name}" created successfully!` });
      }
      setFormOpen(false);
    } catch (err) {
      setAlertMsg({ type: 'error', text: err.data?.message || 'Operation failed.' });
    }
  };

  // Submit Deletion
  const handleDeleteConfirm = async () => {
    setAlertMsg({ type: '', text: '' });
    try {
      await deleteUser(userToDelete._id).unwrap();
      setAlertMsg({ type: 'success', text: `User "${userToDelete.name}" deleted successfully!` });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setAlertMsg({ type: 'error', text: err.data?.message || 'Failed to delete user.' });
    }
  };

  // Toggle Activation State (Active / Deactive) directly from DataGrid
  const handleToggleStatus = async (user) => {
    try {
      await updateUser({
        id: user._id,
        isActive: !user.isActive,
      }).unwrap();
      setAlertMsg({ type: 'success', text: `User status updated successfully!` });
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update user status.' });
    }
  };

  // Table Columns
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150, renderCell: (params) => (
      <Box sx={{ py: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {params.row.name}
        </Typography>
        {params.row.role === 'student' && params.row.studentInfo && (
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
            Roll: {params.row.studentInfo.rollNumber}
          </Typography>
        )}
      </Box>
    )},
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 180 },
    {
      field: 'role',
      headerName: 'Role',
      width: 130,
      renderCell: (params) => {
        const roleColors = {
          admin: 'error',
          faculty: 'success',
          student: 'primary',
          accounts: 'warning',
        };
        return (
          <Chip
            label={params.value.toUpperCase()}
            color={roleColors[params.value] || 'default'}
            size="small"
            sx={{ fontWeight: 700, fontSize: '0.7rem' }}
          />
        );
      },
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          color={params.value ? 'success' : 'error'}
          onClick={() => handleToggleStatus(params.row)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.75rem',
            px: 1.5,
          }}
        >
          {params.value ? 'Active' : 'Inactive'}
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={0.5}>
          <IconButton onClick={() => handleOpenEdit(params.row)} size="small" color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleOpenDelete(params.row)} size="small" color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ py: 1 }}>
      {/* Top Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            User Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Configure profiles, system access roles, and database records.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleOpenAdd}
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#0ea5e9',
            boxShadow: 'none',
            borderRadius: 2.5,
            textTransform: 'none',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#0284c7', boxShadow: 'none' },
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Alert Notifications */}
      {alertMsg.text && (
        <Box mb={3}>
          <Alert severity={alertMsg.type} onClose={() => setAlertMsg({ type: '', text: '' })} sx={{ borderRadius: 2 }}>
            {alertMsg.text}
          </Alert>
        </Box>
      )}

      {/* Filter Toolbar */}
      <Box component="form" onSubmit={handleSearchSubmit} display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          size="small"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flexGrow: 1,
            maxWidth: 320,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2.5,
              backgroundColor: '#ffffff',
            },
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />,
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="role-filter-label">Role</InputLabel>
          <Select
            labelId="role-filter-label"
            id="role-filter"
            value={roleFilter}
            label="Role"
            onChange={handleRoleFilterChange}
            sx={{
              borderRadius: 2.5,
              backgroundColor: '#ffffff',
            }}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="faculty">Faculty</MenuItem>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="accounts">Accounts</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="outlined"
          sx={{
            borderRadius: 2.5,
            textTransform: 'none',
            fontWeight: 700,
            borderColor: '#cbd5e1',
            color: '#475569',
            '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' },
          }}
        >
          Search
        </Button>
      </Box>

      {/* Table DataGrid Container */}
      <Paper
        sx={{
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.01)',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ width: '100%', height: 500 }}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <InfinityLoader size={90} text="Loading user data..." />
            </Box>
          ) : error ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography color="error">Error loading user list.</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={data?.users || []}
              columns={columns}
              getRowId={(row) => row._id}
              pagination
              paginationMode="server"
              rowCount={data?.pagination?.total || 0}
              paginationModel={{ page, pageSize }}
              onPaginationModelChange={(model) => {
                setPage(model.page);
                setPageSize(model.pageSize);
              }}
              loading={isFetching}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  fontWeight: 800,
                  color: '#475569',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f1f5f9',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f8fafc',
                },
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Form Dialog Modal (Add/Edit) */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1e293b', pb: 1 }}>
          {editingUser ? 'Edit User Profile' : 'Create New User Account'}
        </DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Full Name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="password"
                  label={editingUser ? 'Password (leave blank to keep)' : 'Password'}
                  type="password"
                  fullWidth
                  required={!editingUser}
                  value={formData.password}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl size="small" fullWidth disabled={!!editingUser}>
                  <InputLabel id="dialog-role-label">Role</InputLabel>
                  <Select
                    labelId="dialog-role-label"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="faculty">Faculty</MenuItem>
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="accounts">Accounts</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Conditional Student Fields */}
              {formData.role === 'student' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mt: 1, mb: -1 }}>
                      Student Custom Fields
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="dept-label">Department</InputLabel>
                      <Select
                        labelId="dept-label"
                        name="department"
                        value={formData.department}
                        label="Department"
                        onChange={handleChange}
                      >
                        <MenuItem value="Computer Science">Computer Science</MenuItem>
                        <MenuItem value="Information Technology">Information Technology</MenuItem>
                        <MenuItem value="Electrical Engineering">Electrical Engineering</MenuItem>
                        <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="batch"
                      label="Academic Batch (e.g., 2023-2027)"
                      fullWidth
                      value={formData.batch}
                      onChange={handleChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="semester"
                      label="Current Semester"
                      type="number"
                      fullWidth
                      value={formData.semester}
                      onChange={handleChange}
                      size="small"
                      inputProps={{ min: 1, max: 8 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="dues"
                      label="Outstanding Dues ($)"
                      type="number"
                      fullWidth
                      value={formData.dues}
                      onChange={handleChange}
                      size="small"
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
            <Button
              onClick={() => setFormOpen(false)}
              sx={{ color: '#64748b', textTransform: 'none', fontWeight: 700 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isCreating || isUpdating}
              sx={{
                backgroundColor: '#0ea5e9',
                boxShadow: 'none',
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                '&:hover': { backgroundColor: '#0284c7', boxShadow: 'none' },
              }}
            >
              {isCreating || isUpdating ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1e293b' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Are you sure you want to permanently delete the user account for{' '}
            <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
          </Typography>
          {userToDelete?.role === 'student' && (
            <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 600 }}>
              WARNING: This will cascade delete their associated Student Record and Transaction History.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: '#64748b', textTransform: 'none', fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            sx={{
              boxShadow: 'none',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              '&:hover': { boxShadow: 'none' },
            }}
          >
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Permanently Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Users;
export { Users };
