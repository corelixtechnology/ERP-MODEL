import React, { useState } from 'react';
import {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetFacultyUsersQuery,
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
  IconButton,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

function Courses() {
  // Pagination State
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Queries & Mutations
  const { data, isLoading, isFetching, error } = useGetCoursesQuery({
    page: page + 1,
    limit: pageSize,
  });

  const { data: facultyData, isLoading: isFacultyLoading } = useGetFacultyUsersQuery();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); // null means adding
  const [formData, setFormData] = useState({
    courseCode: '',
    title: '',
    credits: 3,
    department: 'Computer Science',
    semester: 1,
    faculty: '',
  });

  // Action feedback
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const facultyList = facultyData?.users || [];

  // Open Form for Creation
  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({
      courseCode: '',
      title: '',
      credits: 3,
      department: 'Computer Science',
      semester: 1,
      faculty: facultyList[0]?._id || '',
    });
    setFormOpen(true);
  };

  // Open Form for Editing
  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      courseCode: course.courseCode,
      title: course.title,
      credits: course.credits,
      department: course.department,
      semester: course.semester,
      faculty: course.faculty?._id || '',
    });
    setFormOpen(true);
  };

  // Open Delete Confirmation
  const handleOpenDelete = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'credits' || name === 'semester' ? Number(value) : value,
    }));
  };

  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setAlertMsg({ type: '', text: '' });

    if (!formData.faculty) {
      setAlertMsg({ type: 'error', text: 'Please assign a faculty member to this course.' });
      return;
    }

    try {
      if (editingCourse) {
        await updateCourse({
          id: editingCourse._id,
          ...formData,
        }).unwrap();
        setAlertMsg({ type: 'success', text: `Course "${formData.title}" updated successfully!` });
      } else {
        await createCourse(formData).unwrap();
        setAlertMsg({ type: 'success', text: `Course "${formData.title}" created successfully!` });
      }
      setFormOpen(false);
    } catch (err) {
      setAlertMsg({ type: 'error', text: err.data?.message || 'Operation failed.' });
    }
  };

  // Delete Confirm
  const handleDeleteConfirm = async () => {
    setAlertMsg({ type: '', text: '' });
    try {
      await deleteCourse(courseToDelete._id).unwrap();
      setAlertMsg({ type: 'success', text: `Course "${courseToDelete.title}" deleted successfully!` });
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (err) {
      setAlertMsg({ type: 'error', text: err.data?.message || 'Failed to delete course.' });
    }
  };

  // Table Columns
  const columns = [
    { field: 'courseCode', headerName: 'Code', width: 130, renderCell: (params) => (
      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0ea5e9' }}>
        {params.value}
      </Typography>
    )},
    { field: 'title', headerName: 'Course Title', flex: 1.5, minWidth: 200, renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
        {params.value}
      </Typography>
    )},
    { field: 'credits', headerName: 'Credits', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'department', headerName: 'Department', flex: 1, minWidth: 150 },
    { field: 'semester', headerName: 'Semester', width: 110, align: 'center', headerAlign: 'center', renderCell: (params) => `Sem ${params.value}` },
    {
      field: 'faculty',
      headerName: 'Assigned Faculty',
      flex: 1.2,
      minWidth: 170,
      valueGetter: (value, row) => row.faculty?.name || 'Unassigned',
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 650, color: '#475569' }}>
            {params.row.faculty?.name || 'Unassigned'}
          </Typography>
          {params.row.faculty && (
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
              {params.row.faculty.email}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
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
      {/* Top Banner */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Course Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Create academic curriculum schemas, specify credits, and assign faculty.
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
          Add Course
        </Button>
      </Box>

      {/* Alerts */}
      {alertMsg.text && (
        <Box mb={3}>
          <Alert severity={alertMsg.type} onClose={() => setAlertMsg({ type: '', text: '' })} sx={{ borderRadius: 2 }}>
            {alertMsg.text}
          </Alert>
        </Box>
      )}

      {/* Grid Container */}
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
              <CircularProgress size={45} thickness={4} sx={{ color: '#0ea5e9' }} />
            </Box>
          ) : error ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography color="error">Error loading courses list.</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={data?.courses || []}
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

      {/* Add / Edit Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1e293b', pb: 1 }}>
          {editingCourse ? 'Edit Course Settings' : 'Create New Course'}
        </DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="courseCode"
                  label="Course Code (e.g., CS101)"
                  fullWidth
                  required
                  value={formData.courseCode}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="title"
                  label="Course Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="credits"
                  label="Credits (e.g., 3)"
                  type="number"
                  fullWidth
                  required
                  value={formData.credits}
                  onChange={handleChange}
                  size="small"
                  inputProps={{ min: 1, max: 6 }}
                />
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
                  name="semester"
                  label="Semester"
                  type="number"
                  fullWidth
                  required
                  value={formData.semester}
                  onChange={handleChange}
                  size="small"
                  inputProps={{ min: 1, max: 8 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="faculty-label">Assign Faculty</InputLabel>
                  <Select
                    labelId="faculty-label"
                    name="faculty"
                    value={formData.faculty}
                    label="Assign Faculty"
                    onChange={handleChange}
                    disabled={isFacultyLoading}
                  >
                    {isFacultyLoading ? (
                      <MenuItem value="">Loading faculty list...</MenuItem>
                    ) : facultyList.length === 0 ? (
                      <MenuItem value="">No Faculty accounts exist!</MenuItem>
                    ) : (
                      facultyList.map((fac) => (
                        <MenuItem key={fac._id} value={fac._id}>
                          {fac.name} ({fac.email})
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
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

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1e293b' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Are you sure you want to permanently delete course{' '}
            <strong>{courseToDelete?.title} ({courseToDelete?.courseCode})</strong>?
          </Typography>
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
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Delete Course'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Courses;
export { Courses };
