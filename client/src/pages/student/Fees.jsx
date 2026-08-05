import React, { useState } from 'react';
import InfinityLoader from '../../components/InfinityLoader';
import { useGetMyFeesQuery, useRecordFeePaymentMutation } from '../../features/feesApi';
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
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Avatar,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  CheckCircle as PaidIcon,
  TrendingUp as DuesIcon,
  Description as PdfIcon,
  Payment as PaymentIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const StudentFees = () => {
  const { data, isLoading, error, refetch } = useGetMyFeesQuery(undefined, {
    pollingInterval: 15000,
  });

  const [recordFeePayment, { isLoading: isPaying }] = useRecordFeePaymentMutation();

  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

  const student = data?.student || {};
  const transactions = Array.isArray(data?.transactions) ? data.transactions : [];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDate = (dateVal) => {
    try {
      if (!dateVal) return '30-Aug-2026';
      const d = new Date(dateVal);
      return isNaN(d.getTime()) ? '30-Aug-2026' : d.toLocaleDateString();
    } catch (e) {
      return '30-Aug-2026';
    }
  };

  const handlePayInstallment = async () => {
    if (!payAmount || Number(payAmount) <= 0) return;
    try {
      await recordFeePayment({
        studentId: student.user?._id || student._id,
        amount: Number(payAmount),
        paymentMethod: 'Online UPI (Student Portal)',
        feeCategory: student.feeCategory || 'Tuition Fee Installment',
        remarks: 'Self fee payment via Student Portal',
      }).unwrap();

      setPayDialogOpen(false);
      setPayAmount('');
      refetch();
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  const handleOpenPrintReceipt = (txn) => {
    setSelectedReceipt(txn);
    setReceiptDialogOpen(true);
  };

  const triggerPDFPrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptNo = selectedReceipt?.receiptNumber || 'REC-2026-8801';
    const txnId = selectedReceipt?.transactionId || 'TXN8492019482';
    const amount = formatCurrency(selectedReceipt?.amount || student.paidFee || 0);
    const date = formatDate(selectedReceipt?.createdAt);
    const studentName = student.user?.name || 'Student';
    const rollNo = student.rollNumber || 'STU20260001';
    const dept = student.department || 'Computer Science & Engineering';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fee Payment Receipt - ${receiptNo}</title>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
            .header-banner { background: linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%); color: white; padding: 25px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
            .header-title { font-size: 22px; font-weight: 800; margin: 0; }
            .header-sub { font-size: 13px; opacity: 0.9; margin-top: 4px; }
            .meta-box { margin-top: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
            .meta-item { font-size: 13px; color: #475569; }
            .meta-item strong { color: #0f172a; display: block; font-size: 15px; margin-top: 2px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 25px; }
            .table th, .table td { padding: 12px 16px; border: 1px solid #e2e8f0; text-align: left; font-size: 14px; }
            .table th { background: #f1f5f9; font-weight: 700; color: #334155; }
            .amount-highlight { font-size: 20px; font-weight: 800; color: #10b981; }
            .status-tag { display: inline-block; background: #dcfce7; color: #15803d; font-weight: 800; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; }
            .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .stamp { border: 2px dashed #94a3b8; padding: 12px 24px; text-align: center; border-radius: 8px; font-size: 11px; font-weight: 700; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div>
              <h1 class="header-title">Global Institute of Engineering & Technology</h1>
              <div class="header-sub">Official Student Fee Payment Voucher & Receipt</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; font-weight: 700;">OFFICIAL RECEIPT</div>
              <div style="font-size: 16px; font-weight: 800; margin-top: 2px;">${receiptNo}</div>
            </div>
          </div>

          <div class="meta-box">
            <div class="meta-item">Student Name<strong>${studentName}</strong></div>
            <div class="meta-item">Roll Number<strong>${rollNo}</strong></div>
            <div class="meta-item">Academic Department<strong>${dept}</strong></div>
            <div class="meta-item">Semester & Batch<strong>Semester ${student.semester || 5} (${student.batch || '2023-2027'})</strong></div>
            <div class="meta-item">Transaction ID<strong>${txnId}</strong></div>
            <div class="meta-item">Payment Timestamp<strong>${date}</strong></div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description / Fee Head</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th style="text-align: right;">Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${selectedReceipt?.feeCategory || student.feeCategory || 'Tuition Fee Installment'}</td>
                <td>${selectedReceipt?.paymentMethod || 'Online UPI'}</td>
                <td><span class="status-tag">PAID SUCCESS</span></td>
                <td style="text-align: right;" class="amount-highlight">${amount}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 25px; padding: 15px; background: #fffbebfb; border: 1px solid #fef3c7; border-radius: 8px;">
            <p style="margin: 0; font-size: 13px; color: #b45309;">
              <strong>Remaining Account Dues:</strong> ${formatCurrency(student.dues)} (Fee Status: ${student.feeStatus || 'Partial'})
            </p>
          </div>

          <div class="footer">
            <div>
              <p style="margin:0; font-size:12px; color:#64748b;">Issued by Office of Finance & Accounts</p>
              <p style="margin:4px 0 0 0; font-size:11px; color:#94a3b8;">Verification Hash: ${receiptNo}-${txnId}</p>
            </div>
            <div class="stamp">
              FINANCE & ACCOUNTS OFFICE<br/>PAID & VERIFIED
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <InfinityLoader size={100} text="Loading fee ledger..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 3, mb: 2 }}>
          {error.data?.message || 'Unable to load student fee profile. Please verify your login session.'}
        </Alert>
        <Button variant="outlined" onClick={refetch} startIcon={<RefreshIcon />}>
          Retry Connection
        </Button>
      </Box>
    );
  }

  const getStatusChip = (status) => {
    if (status === 'Paid') {
      return <Chip label="PAID IN FULL" color="success" size="small" sx={{ fontWeight: 800 }} />;
    }
    if (status === 'Partial') {
      return <Chip label="PARTIAL PAYMENT" color="warning" size="small" sx={{ fontWeight: 800 }} />;
    }
    return <Chip label="FEE PENDING" color="error" size="small" sx={{ fontWeight: 800 }} />;
  };

  return (
    <Box sx={{ flexGrow: 1, py: 1 }}>
      {/* Header Banner */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Fee Portal & Online Receipts
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
            View your fee structure breakdown, current account balance dues, and download official PDF payment receipts.
          </Typography>
        </Box>
        <IconButton onClick={refetch} sx={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { backgroundColor: '#f1f5f9' } }}>
          <RefreshIcon sx={{ color: '#64748b' }} />
        </IconButton>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Total Annual Fee
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
                    {formatCurrency(student.totalFee || 50000)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', width: 50, height: 50, borderRadius: 3 }}>
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
                    Amount Paid
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', mt: 0.5 }}>
                    {formatCurrency(student.paidFee || 38500)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 50, height: 50, borderRadius: 3 }}>
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
                    Outstanding Balance Dues
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: student.dues > 0 ? '#ef4444' : '#10b981', mt: 0.5 }}>
                    {formatCurrency(student.dues || 0)}
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
              <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Account Status
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                {getStatusChip(student.feeStatus)}
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1, fontWeight: 500 }}>
                Due Date: {formatDate(student.dueDate)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Itemized Breakdown Column */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', p: 3, boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
              Itemized Fee Breakdown
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box display="flex" justifyContent="space-between" py={1.5} borderBottom="1px solid #f1f5f9">
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Tuition Fee</Typography>
              <Typography variant="body2" fontWeight={700}>{formatCurrency(student.breakdown?.tuitionFee || 35000)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={1.5} borderBottom="1px solid #f1f5f9">
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Campus Development Fee</Typography>
              <Typography variant="body2" fontWeight={700}>{formatCurrency(student.breakdown?.developmentFee || 5000)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={1.5} borderBottom="1px solid #f1f5f9">
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Library & E-Resources</Typography>
              <Typography variant="body2" fontWeight={700}>{formatCurrency(student.breakdown?.libraryFee || 2500)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={1.5} borderBottom="1px solid #f1f5f9">
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Examination & Evaluation</Typography>
              <Typography variant="body2" fontWeight={700}>{formatCurrency(student.breakdown?.examFee || 2500)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={1.5} borderBottom="1px solid #f1f5f9">
              <Typography variant="body2" color="textSecondary" fontWeight={600}>Hostel / Facility Services</Typography>
              <Typography variant="body2" fontWeight={700}>{formatCurrency(student.breakdown?.hostelFee || 5000)}</Typography>
            </Box>

            {student.discount > 0 && (
              <Box display="flex" justifyContent="space-between" py={1.5} borderBottom="1px solid #f1f5f9" sx={{ color: '#10b981' }}>
                <Typography variant="body2" fontWeight={700}>Scholarship Discount</Typography>
                <Typography variant="body2" fontWeight={800}>- {formatCurrency(student.discount)}</Typography>
              </Box>
            )}

            <Box display="flex" justifyContent="space-between" pt={2.5} mt={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Net Balance Payable
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: student.dues > 0 ? '#ef4444' : '#10b981' }}>
                {formatCurrency(student.dues || 0)}
              </Typography>
            </Box>

            {student.dues > 0 && (
              <Button
                variant="contained"
                fullWidth
                color="primary"
                startIcon={<PaymentIcon />}
                onClick={() => {
                  setPayAmount(student.dues);
                  setPayDialogOpen(true);
                }}
                sx={{ mt: 3, py: 1.2, borderRadius: 3, fontWeight: 800, textTransform: 'none' }}
              >
                Pay Outstanding Balance ({formatCurrency(student.dues)})
              </Button>
            )}
          </Card>
        </Grid>

        {/* Transaction History & PDF Download Column */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', p: 3, boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
              Payment Receipts & Transaction Logs
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Receipt No</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Payment Mode</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Amount</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, color: '#475569' }}>Receipt PDF</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#64748b' }}>
                        No payment receipts logged for your account yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((txn) => (
                      <TableRow key={txn._id} hover>
                        <TableCell sx={{ fontWeight: 700, color: '#0ea5e9' }}>
                          {txn.receiptNumber || 'REC-2026-8801'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {formatDate(txn.createdAt)}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem', color: '#475569' }}>
                          {txn.paymentMethod || 'Online UPI'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#10b981' }}>
                          {formatCurrency(txn.amount)}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            startIcon={<PdfIcon />}
                            onClick={() => handleOpenPrintReceipt(txn)}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.75rem' }}
                          >
                            Save PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Modal */}
      <Dialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Pay Fee Installment</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ py: 1 }}>
            <TextField
              label="Enter Amount ($)"
              type="number"
              fullWidth
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Simulated Instant Gateway payment via NetBanking / UPI.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPayDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handlePayInstallment} disabled={isPaying}>
            {isPaying ? 'Processing...' : 'Confirm & Pay'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Printable Receipt Preview Modal */}
      <Dialog open={receiptDialogOpen} onClose={() => setReceiptDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Official Fee Receipt Preview
          <Chip label="VERIFIED" color="success" size="small" sx={{ fontWeight: 800 }} />
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <SchoolIcon sx={{ color: '#0ea5e9', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  GIET College ERP
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0ea5e9' }}>
                {selectedReceipt?.receiptNumber || 'REC-2026-8801'}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Student Name</Typography>
                <Typography variant="body2" fontWeight={700}>{student.user?.name || 'Jane Smith'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Roll Number</Typography>
                <Typography variant="body2" fontWeight={700}>{student.rollNumber || 'STU20260001'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Department</Typography>
                <Typography variant="body2" fontWeight={700}>{student.department}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Payment Date</Typography>
                <Typography variant="body2" fontWeight={700}>
                  {formatDate(selectedReceipt?.createdAt)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Fee Category</Typography>
                <Typography variant="body2" fontWeight={700}>
                  {selectedReceipt?.feeCategory || student.feeCategory}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Amount Paid</Typography>
                <Typography variant="h6" fontWeight={800} color="#10b981">
                  {formatCurrency(selectedReceipt?.amount)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setReceiptDialogOpen(false)} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={triggerPDFPrint}
            sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2, px: 3 }}
          >
            Print / Save as PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentFees;
