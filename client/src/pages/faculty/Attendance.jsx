import React, { useState } from 'react';
import { useGetAttendanceQuery, useMarkAttendanceMutation } from '../../features/attendanceApi';
import {
  Box,
  Grid,
  Card,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Avatar,
  TextField,
} from '@mui/material';
import {
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  AccessTime as LateIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  School as SchoolIcon,
  QrCodeScanner as QrIcon,
} from '@mui/icons-material';

const FacultyAttendance = () => {
  const { data, isLoading, refetch } = useGetAttendanceQuery(undefined, { pollingInterval: 15000 });
  const [markAttendance, { isLoading: isSaving }] = useMarkAttendanceMutation();

  const [selectedCourse, setSelectedCourse] = useState('CS101');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [alertMsg, setAlertMsg] = useState(null);

  // Mock roster of students for faculty marking
  const [studentRoster, setStudentRoster] = useState([
    { id: '65f1a2b3c4d5e6f7a8b9c0d1', name: 'Jane Smith', rollNumber: 'STU20260001', dept: 'Computer Science', status: 'Present' },
    { id: '65f1a2b3c4d5e6f7a8b9c0d2', name: 'Alex Morgan', rollNumber: 'STU20260002', dept: 'Computer Science', status: 'Present' },
    { id: '65f1a2b3c4d5e6f7a8b9c0d3', name: 'Sophia Chen', rollNumber: 'STU20260003', dept: 'Computer Science', status: 'Absent' },
    { id: '65f1a2b3c4d5e6f7a8b9c0d4', name: 'Liam Johnson', rollNumber: 'STU20260004', dept: 'Computer Science', status: 'Late' },
    { id: '65f1a2b3c4d5e6f7a8b9c0d5', name: 'Noah Williams', rollNumber: 'STU20260005', dept: 'Electronics & Comm.', status: 'Present' },
    { id: '65f1a2b3c4d5e6f7a8b9c0d6', name: 'Emma Watson', rollNumber: 'STU20260006', dept: 'Mechanical Eng.', status: 'Present' },
  ]);

  const handleStatusToggle = (index, newStatus) => {
    const updated = [...studentRoster];
    updated[index].status = newStatus;
    setStudentRoster(updated);
  };

  const handleSaveAttendanceRegistry = async () => {
    try {
      // Save attendance records in parallel
      for (const student of studentRoster) {
        await markAttendance({
          student: student.id,
          course: '65f1a2b3c4d5e6f7a8b9c0f1', // Demo Course ID
          status: student.status,
          method: 'Manual',
        }).unwrap();
      }
      setAlertMsg({ type: 'success', text: `Attendance registry for ${selectedCourse} on ${selectedDate} saved successfully!` });
      refetch();
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to record attendance registry.' });
    }
  };

  return (
    <Box sx={{ flexGrow: 1, py: 1 }}>
      {/* Header Banner */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Faculty Attendance Registry
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
            Mark, review, and lock daily lecture attendance for enrolled students.
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

      {/* Roster Controls & Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel>Select Lecture Course</InputLabel>
            <Select
              value={selectedCourse}
              label="Select Lecture Course"
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <MenuItem value="CS101">CS101 — Data Structures & Algorithms</MenuItem>
              <MenuItem value="CS102">CS102 — Database Management Systems</MenuItem>
              <MenuItem value="CS103">CS103 — Operating Systems</MenuItem>
              <MenuItem value="CS104">CS104 — Web Technologies & Frameworks</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Lecture Date"
            type="date"
            size="small"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 180 }}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveAttendanceRegistry}
          disabled={isSaving}
          sx={{ borderRadius: 3, py: 1, px: 3, fontWeight: 800, textTransform: 'none' }}
        >
          {isSaving ? 'Submitting...' : 'Save & Lock Attendance'}
        </Button>
      </Paper>

      {/* Roster Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Student Name</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Roll Number</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Department</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, color: '#475569' }}>Attendance Status Toggle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentRoster.map((student, idx) => (
              <TableRow key={student.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ bgcolor: '#0ea5e9', width: 36, height: 36, fontWeight: 700, fontSize: '0.85rem' }}>
                      {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {student.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#0ea5e9' }}>
                  {student.rollNumber}
                </TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>
                  {student.dept}
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Button
                      variant={student.status === 'Present' ? 'contained' : 'outlined'}
                      color="success"
                      size="small"
                      startIcon={<PresentIcon />}
                      onClick={() => handleStatusToggle(idx, 'Present')}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800 }}
                    >
                      Present
                    </Button>
                    <Button
                      variant={student.status === 'Late' ? 'contained' : 'outlined'}
                      color="warning"
                      size="small"
                      startIcon={<LateIcon />}
                      onClick={() => handleStatusToggle(idx, 'Late')}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800 }}
                    >
                      Late
                    </Button>
                    <Button
                      variant={student.status === 'Absent' ? 'contained' : 'outlined'}
                      color="error"
                      size="small"
                      startIcon={<AbsentIcon />}
                      onClick={() => handleStatusToggle(idx, 'Absent')}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800 }}
                    >
                      Absent
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FacultyAttendance;
