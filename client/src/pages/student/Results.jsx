import React, { useState } from 'react';
import { useGetMarksQuery } from '../../features/resultsApi';
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
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Avatar,
  Button,
  Divider,
} from '@mui/material';
import {
  Grade as GradeIcon,
  School as SchoolIcon,
  EmojiEvents as RankIcon,
  Description as PdfIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Verified as VerifiedIcon,
  CheckCircle as PassIcon,
} from '@mui/icons-material';

const StudentResults = () => {
  const { data, isLoading, error, refetch } = useGetMarksQuery(undefined, {
    pollingInterval: 15000,
  });

  const marksRecords = Array.isArray(data) ? data : [];

  // Fallback demo data if DB records empty
  const records = marksRecords.length > 0 ? marksRecords : [
    {
      _id: 'm1',
      marksObtained: 94,
      grade: 'O',
      remarks: 'Perfect code implementation & algorithm design',
      exam: {
        title: 'Practical Lab Exam — DS & Algorithms',
        examType: 'Practical',
        maxMarks: 100,
        course: { title: 'Data Structures & Algorithms', courseCode: 'CS101' },
      },
    },
    {
      _id: 'm2',
      marksObtained: 46,
      grade: 'A+',
      remarks: 'Excellent score in Mid-Sem theory (92%)',
      exam: {
        title: 'Mid-Semester Exam — Data Structures',
        examType: 'MidSem',
        maxMarks: 50,
        course: { title: 'Data Structures & Algorithms', courseCode: 'CS101' },
      },
    },
    {
      _id: 'm3',
      marksObtained: 88,
      grade: 'A+',
      remarks: 'Top 5 percentile overall ranking',
      exam: {
        title: 'End-Semester Theory Exam — CS101',
        examType: 'EndSem',
        maxMarks: 100,
        course: { title: 'Data Structures & Algorithms', courseCode: 'CS101' },
      },
    },
    {
      _id: 'm4',
      marksObtained: 44,
      grade: 'A',
      remarks: 'Strong relational schema design skills',
      exam: {
        title: 'Mid-Semester Exam — Database Systems',
        examType: 'MidSem',
        maxMarks: 50,
        course: { title: 'Database Management Systems', courseCode: 'CS102' },
      },
    },
  ];

  // Calculate CGPA metrics
  const totalObtained = records.reduce((acc, curr) => acc + (curr.marksObtained || 0), 0);
  const totalMax = records.reduce((acc, curr) => acc + (curr.exam?.maxMarks || 100), 0);
  const aggregatePercentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '90.5';

  const formatCurrency = (val) => val;

  const triggerTranscriptPrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Grade Transcript - GIET College</title>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 850px; margin: 0 auto; }
            .header-banner { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 25px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
            .header-title { font-size: 22px; font-weight: 800; margin: 0; }
            .header-sub { font-size: 13px; opacity: 0.9; margin-top: 4px; color: #38bdf8; }
            .meta-box { margin-top: 25px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
            .meta-item { font-size: 13px; color: #475569; }
            .meta-item strong { color: #0f172a; display: block; font-size: 15px; margin-top: 2px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 25px; }
            .table th, .table td { padding: 12px 16px; border: 1px solid #e2e8f0; text-align: left; font-size: 14px; }
            .table th { background: #f1f5f9; font-weight: 700; color: #334155; }
            .grade-tag { display: inline-block; background: #dcfce7; color: #15803d; font-weight: 800; padding: 4px 12px; border-radius: 6px; font-size: 12px; }
            .footer { margin-top: 50px; border-top: 1px solid #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .stamp { border: 2px dashed #94a3b8; padding: 12px 24px; text-align: center; border-radius: 8px; font-size: 11px; font-weight: 700; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div>
              <h1 class="header-title">Global Institute of Engineering & Technology</h1>
              <div class="header-sub">OFFICIAL ACADEMIC GRADE TRANSCRIPT & MARKSHEET</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; font-weight: 700;">SEMESTER V</div>
              <div style="font-size: 16px; font-weight: 800; margin-top: 2px;">2026 ACADEMIC YEAR</div>
            </div>
          </div>

          <div class="meta-box">
            <div class="meta-item">Student Name<strong>Jane Smith</strong></div>
            <div class="meta-item">Roll Number<strong>STU20260001</strong></div>
            <div class="meta-item">Department<strong>Computer Science & Eng.</strong></div>
            <div class="meta-item">Aggregate Score<strong>${aggregatePercentage}% (${totalObtained} / ${totalMax})</strong></div>
            <div class="meta-item">Semester GPA<strong>9.25 / 10.0 CGPA</strong></div>
            <div class="meta-item">Class Standing<strong>FIRST CLASS WITH DISTINCTION</strong></div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Course / Exam Title</th>
                <th>Course Code</th>
                <th>Marks Obtained</th>
                <th>Max Marks</th>
                <th>Grade</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              ${records.map(r => `
                <tr>
                  <td>${r.exam?.title || 'Examination'}</td>
                  <td>${r.exam?.course?.courseCode || 'CS101'}</td>
                  <td><strong>${r.marksObtained}</strong></td>
                  <td>${r.exam?.maxMarks || 100}</td>
                  <td><span class="grade-tag">${r.grade || 'A+'}</span></td>
                  <td><strong style="color:#10b981;">PASS</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div>
              <p style="margin:0; font-size:12px; color:#64748b;">Issued by Office of Controller of Examinations</p>
              <p style="margin:4px 0 0 0; font-size:11px; color:#94a3b8;">Verification Code: TRANSCRIPT-2026-GIET-OFFICIAL</p>
            </div>
            <div class="stamp">
              CONTROLLER OF EXAMINATIONS<br/>SEAL & VERIFIED
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

  const getGradeChip = (grade) => {
    if (grade === 'O' || grade === 'A+') {
      return <Chip label={grade} color="success" size="small" sx={{ fontWeight: 900, px: 1 }} />;
    }
    if (grade === 'A' || grade === 'B+') {
      return <Chip label={grade} color="primary" size="small" sx={{ fontWeight: 900, px: 1 }} />;
    }
    return <Chip label={grade || 'B'} color="warning" size="small" sx={{ fontWeight: 900, px: 1 }} />;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress size={50} thickness={4} sx={{ color: '#0ea5e9' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 1 }}>
      {/* Header Banner */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            My Grades Sheet & Transcripts
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
            Official examination marks, grade points, semester GPA transcripts, and printable certificates.
          </Typography>
        </Box>
        <Box display="flex" gap={1.5}>
          <IconButton onClick={refetch} sx={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { backgroundColor: '#f1f5f9' } }}>
            <RefreshIcon sx={{ color: '#64748b' }} />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={triggerTranscriptPrint}
            sx={{ borderRadius: 3, fontWeight: 800, px: 2.5, textTransform: 'none' }}
          >
            Download / Print Official Transcript PDF
          </Button>
        </Box>
      </Box>

      {/* Top 4 KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Semester GPA
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#0ea5e9', mt: 0.5 }}>
                    9.25 / 10.0
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', width: 52, height: 52, borderRadius: 3 }}>
                  <GradeIcon />
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
                    Aggregate Score
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#10b981', mt: 0.5 }}>
                    {aggregatePercentage}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 52, height: 52, borderRadius: 3 }}>
                  <PassIcon />
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
                    Class Standing
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#8b5cf6', mt: 0.5 }}>
                    Top 5% Rank
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', width: 52, height: 52, borderRadius: 3 }}>
                  <RankIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Academic Distinction
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  icon={<VerifiedIcon />}
                  label="FIRST CLASS WITH DISTINCTION"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 800, fontSize: '0.65rem' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grade Ledger Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Examination Title</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Course Code & Name</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Exam Type</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Marks Obtained</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Grade</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Remarks & Performance</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, color: '#475569' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell sx={{ fontWeight: 700, color: '#0ea5e9' }}>
                  {row.exam?.title || 'Semester Exam'}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {row.exam?.course?.courseCode || 'CS101'} — {row.exam?.course?.title || 'Computer Science'}
                </TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>
                  {row.exam?.examType || 'MidSem'}
                </TableCell>
                <TableCell sx={{ fontWeight: 900, color: '#10b981', fontSize: '1rem' }}>
                  {row.marksObtained} / {row.exam?.maxMarks || 100}
                </TableCell>
                <TableCell>{getGradeChip(row.grade)}</TableCell>
                <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {row.remarks || 'Cleared examination'}
                </TableCell>
                <TableCell align="center">
                  <Chip label="PASS" color="success" size="small" sx={{ fontWeight: 900, fontSize: '0.65rem' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentResults;
