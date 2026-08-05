import React, { useState } from 'react';
import {
  useGetStudentFeesQuery,
  useUpdateStudentFeesMutation,
  useRecordFeePaymentMutation,
} from '../../features/feesApi';
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
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Payment as PaymentIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as DuesIcon,
  CheckCircle as PaidIcon,
  People as StudentsIcon,
} from '@mui/icons-material';

const AccountsFees = () => {
  const { data, isLoading, error, refetch } = useGetStudentFeesQuery(undefined, {
    pollingInterval: 15000,
  });

  const [updateStudentFees, { isLoading: isUpdating }] = useUpdateStudentFeesMutation();
  const [recordFeePayment, { isLoading: isPaying }] = useRecordFeePaymentMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Edit Fee Modal state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    totalFee: 45000,
    paidFee: 0,
    discount: 0,
    feeCategory: 'General Tuition',
    dueDate: '',
    tuitionFee: 30000,
    developmentFee: 5000,
    libraryFee: 2500,
    examFee: 2500,
    hostelFee: 5000,
  });

  // Payment Modal state
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payFormData, setPayFormData] = useState({
    amount: '',
    paymentMethod: 'Online UPI',
    feeCategory: 'Tuition Fee Installment',
    remarks: 'Payment recorded by Accounts Office',
  });

  // Alert message
  const [alertMsg, setAlertMsg] = useState(null);

  // Safely extract students list
  const students = Array.isArray(data) ? data : [];

  // Filter students
  const filteredStudents = students.filter((s) => {
    const studentName = s?.user?.name || '';
    const rollNo = s?.rollNumber || '';
    const dept = s?.department || '';

    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = !selectedDept || dept === selectedDept;

    return matchesSearch && matchesDept;
  });

  // Summary Metrics
  const totalStudentsCount = students.length;
  const totalRevenue = students.reduce((acc, curr) => acc + (curr?.paidFee || 0), 0);
  const totalDues = students.reduce((acc, curr) => acc + (curr?.dues || 0), 0);
  const paidStudentsCount = students.filter((s) => s?.feeStatus === 'Paid').length;

  // Formatter
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDate = (dateVal) => {
    try {
      if (!dateVal) return 'N/A';
      const d = new Date(dateVal);
      return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    let formattedDueDate = '';
    try {
      if (student?.dueDate) {
        const d = new Date(student.dueDate);
        if (!isNaN(d.getTime())) {
          formattedDueDate = d.toISOString().split('T')[0];
        }
      }
    } catch (e) {}

    setEditFormData({
      totalFee: student?.totalFee || 45000,
      paidFee: student?.paidFee || 0,
      discount: student?.discount || 0,
      feeCategory: student?.feeCategory || 'General Tuition',
      dueDate: formattedDueDate,
      tuitionFee: student?.breakdown?.tuitionFee || 30000,
      developmentFee: student?.breakdown?.developmentFee || 5000,
      libraryFee: student?.breakdown?.libraryFee || 2500,
      examFee: student?.breakdown?.examFee || 2500,
      hostelFee: student?.breakdown?.hostelFee || 5000,
    });
    setEditDialogOpen(true);
  };

  // Submit Edit Fee
  const handleSaveFeeEdit = async () => {
    if (!selectedStudent) return;
    try {
      await updateStudentFees({
        id: selectedStudent._id,
        totalFee: Number(editFormData.totalFee),
        paidFee: Number(editFormData.paidFee),
        discount: Number(editFormData.discount),
        feeCategory: editFormData.feeCategory,
        dueDate: editFormData.dueDate,
        breakdown: {
          tuitionFee: Number(editFormData.tuitionFee),
          developmentFee: Number(editFormData.developmentFee),
          libraryFee: Number(editFormData.libraryFee),
          examFee: Number(editFormData.examFee),
          hostelFee: Number(editFormData.hostelFee),
        },
      }).unwrap();

      setAlertMsg({ type: 'success', text: `Successfully updated fee structure for ${selectedStudent.user?.name || 'Student'}!` });
      setEditDialogOpen(false);
    } catch (err) {
      setAlertMsg({ type: 'error', text: err.data?.message || 'Failed to update fee details.' });
    }
  };

  // Open Pay Modal
  const handleOpenPay = (student) => {
    setSelectedStudent(student);
    setPayFormData({
      amount: student?.dues > 0 ? student.dues : 5000,
      paymentMethod: 'Online UPI',
      feeCategory: student?.feeCategory || 'Tuition Fee Installment',
      remarks: `Payment recorded by Accounts for ${student?.rollNumber || ''}`,
    });
    setPayDialogOpen(true);
  };

  // Submit Payment
  const handleSavePayment = async () => {
    if (!selectedStudent || !payFormData.amount) return;
    try {
      await recordFeePayment({
        studentId: selectedStudent.user?._id || selectedStudent._id,
        amount: Number(payFormData.amount),
        paymentMethod: payFormData.paymentMethod,
        feeCategory: payFormData.feeCategory,
        remarks: payFormData.remarks,
      }).unwrap();

      setAlertMsg({ type: 'success', text: `Successfully recorded payment of ${formatCurrency(payFormData.amount)} for ${selectedStudent.user?.name || 'Student'}!` });
      setPayDialogOpen(false);
    } catch (err) {
      setAlertMsg({ type: 'error', text: err.data?.message || 'Failed to record payment.' });
    }
  };

  const getStatusChip = (status) => {
    if (status === 'Paid') {
      return <Chip label="PAID" color="success" size="small" sx={{ fontWeight: 800 }} />;
    }
    if (status === 'Partial') {
      return <Chip label="PARTIAL" color="warning" size="small" sx={{ fontWeight: 800 }} />;
    }
    return <Chip label="PENDING" color="error" size="small" sx={{ fontWeight: 800 }} />;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress size={50} thickness={4} sx={{ color: '#0ea5e9' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 3, mb: 2 }}>
          {error.data?.message || 'Failed to load student fee records. Please ensure you are logged in with Accountant or Admin privileges.'}
        </Alert>
        <Button variant="outlined" onClick={refetch} startIcon={<RefreshIcon />}>
          Retry Connection
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 1 }}>
      {/* Header Banner */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Fee Structure & Student Balances
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
            Accountant Control Center — Edit student fee dues, discounts, and log payment receipts in real-time.
          </Typography>
        </Box>
        <IconButton onClick={refetch} sx={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { backgroundColor: '#f1f5f9' } }}>
          <RefreshIcon sx={{ color: '#64748b' }} />
        </IconButton>
      </Box>

      {alertMsg && (
        <Alert severity={alertMsg.type} onClose={() => setAlertMsg(null)} sx={{ mb: 3, borderRadius: 3 }}>
          {alertMsg.text}
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Total Collected
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', mt: 0.5 }}>
                    {formatCurrency(totalRevenue)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 50, height: 50, borderRadius: 3 }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Outstanding Dues
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#ef4444', mt: 0.5 }}>
                    {formatCurrency(totalDues)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', width: 50, height: 50, borderRadius: 3 }}>
                  <DuesIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Cleared Accounts
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0ea5e9', mt: 0.5 }}>
                    {paidStudentsCount} / {totalStudentsCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', width: 50, height: 50, borderRadius: 3 }}>
                  <PaidIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Active Students
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#8b5cf6', mt: 0.5 }}>
                    {totalStudentsCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', width: 50, height: 50, borderRadius: 3 }}>
                  <StudentsIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter & Search Bar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search by student name or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ minWidth: 300, flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Department Filter</InputLabel>
          <Select
            value={selectedDept}
            label="Department Filter"
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <MenuItem value="">All Departments</MenuItem>
            <MenuItem value="Computer Science & Engineering">Computer Science & Eng.</MenuItem>
            <MenuItem value="Electronics & Communication">Electronics & Comm.</MenuItem>
            <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Student Fees Data Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Student Info</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Roll No & Dept</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Total Fee</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Paid Amount</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Discount</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Remaining Dues</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, color: '#475569' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#64748b' }}>
                  No student fee records found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        alt={student.user?.name}
                        src={student.user?.profilePic}
                        sx={{ bgcolor: '#0ea5e9', width: 36, height: 36, fontWeight: 700, fontSize: '0.85rem' }}
                      >
                        {student.user?.name ? student.user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'S'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          {student.user?.name || 'Unnamed Student'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {student.user?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {student.rollNumber}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      {student.department} (Sem {student.semester})
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatCurrency(student.totalFee)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>
                      {formatCurrency(student.paidFee)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {formatCurrency(student.discount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 800, color: student.dues > 0 ? '#ef4444' : '#10b981' }}
                    >
                      {formatCurrency(student.dues)}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(student.feeStatus)}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={1}>
                      <Tooltip title="Edit Student Fee Structure">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenEdit(student)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                        >
                          Edit Fee
                        </Button>
                      </Tooltip>
                      <Tooltip title="Record Fee Payment">
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          startIcon={<PaymentIcon />}
                          onClick={() => handleOpenPay(student)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                        >
                          Collect
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Student Fee Modal */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          Edit Fee Structure — {selectedStudent?.user?.name} ({selectedStudent?.rollNumber})
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2.5} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Total Annual Fee ($)"
                type="number"
                fullWidth
                value={editFormData.totalFee}
                onChange={(e) => setEditFormData({ ...editFormData, totalFee: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Total Paid Amount ($)"
                type="number"
                fullWidth
                value={editFormData.paidFee}
                onChange={(e) => setEditFormData({ ...editFormData, paidFee: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Scholarship / Discount ($)"
                type="number"
                fullWidth
                value={editFormData.discount}
                onChange={(e) => setEditFormData({ ...editFormData, discount: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Fee Category / Plan Name"
                fullWidth
                value={editFormData.feeCategory}
                onChange={(e) => setEditFormData({ ...editFormData, feeCategory: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Payment Due Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editFormData.dueDate}
                onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 1, mb: 1, color: '#0f172a' }}>
                Itemized Fee Breakdown
              </Typography>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <TextField
                label="Tuition ($)"
                type="number"
                size="small"
                fullWidth
                value={editFormData.tuitionFee}
                onChange={(e) => setEditFormData({ ...editFormData, tuitionFee: e.target.value })}
              />
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <TextField
                label="Development ($)"
                type="number"
                size="small"
                fullWidth
                value={editFormData.developmentFee}
                onChange={(e) => setEditFormData({ ...editFormData, developmentFee: e.target.value })}
              />
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <TextField
                label="Library ($)"
                type="number"
                size="small"
                fullWidth
                value={editFormData.libraryFee}
                onChange={(e) => setEditFormData({ ...editFormData, libraryFee: e.target.value })}
              />
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <TextField
                label="Exam ($)"
                type="number"
                size="small"
                fullWidth
                value={editFormData.examFee}
                onChange={(e) => setEditFormData({ ...editFormData, examFee: e.target.value })}
              />
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <TextField
                label="Hostel ($)"
                type="number"
                size="small"
                fullWidth
                value={editFormData.hostelFee}
                onChange={(e) => setEditFormData({ ...editFormData, hostelFee: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px dashed #cbd5e1' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>
                  Calculated Balance Due:{' '}
                  <span style={{ color: '#ef4444', fontWeight: 800 }}>
                    {formatCurrency(Math.max(0, editFormData.totalFee - editFormData.discount - editFormData.paidFee))}
                  </span>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveFeeEdit}
            disabled={isUpdating}
            sx={{ textTransform: 'none', fontWeight: 700, px: 3, borderRadius: 2 }}
          >
            {isUpdating ? 'Saving...' : 'Save Fee Updates'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Payment Modal */}
      <Dialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          Record Fee Payment — {selectedStudent?.user?.name}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2.5} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Payment Amount ($)"
                type="number"
                fullWidth
                required
                value={payFormData.amount}
                onChange={(e) => setPayFormData({ ...payFormData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  value={payFormData.paymentMethod}
                  label="Payment Mode"
                  onChange={(e) => setPayFormData({ ...payFormData, paymentMethod: e.target.value })}
                >
                  <MenuItem value="Online UPI">Online UPI (GPay/PhonePe)</MenuItem>
                  <MenuItem value="Net Banking">Net Banking (Bank Transfer)</MenuItem>
                  <MenuItem value="Credit Card">Credit Card / Debit Card</MenuItem>
                  <MenuItem value="Cash">Cash (Counter Deposit)</MenuItem>
                  <MenuItem value="Demand Draft">Demand Draft / Cheque</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fee Head / Category"
                fullWidth
                value={payFormData.feeCategory}
                onChange={(e) => setPayFormData({ ...payFormData, feeCategory: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Remarks / Receipt Reference"
                fullWidth
                multiline
                rows={2}
                value={payFormData.remarks}
                onChange={(e) => setPayFormData({ ...payFormData, remarks: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setPayDialogOpen(false)} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSavePayment}
            disabled={isPaying}
            sx={{ textTransform: 'none', fontWeight: 700, px: 3, borderRadius: 2 }}
          >
            {isPaying ? 'Processing...' : 'Confirm Payment Receipt'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsFees;
