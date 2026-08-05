import React, { useState, useEffect } from 'react';
import InfinityLoader from '../../components/InfinityLoader';
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} from '../../features/adminApi';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Save as SaveIcon, Settings as SettingsIcon } from '@mui/icons-material';

function Settings() {
  // Query
  const { data: settingsData, isLoading, error } = useGetSystemSettingsQuery();

  // Mutation
  const [updateSystemSettings, { isLoading: isUpdating }] = useUpdateSystemSettingsMutation();

  // Local Form State
  const [formData, setFormData] = useState({
    collegeName: '',
    academicYear: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Sync query data to local state
  useEffect(() => {
    if (settingsData?.settings) {
      setFormData({
        collegeName: settingsData.settings.collegeName || '',
        academicYear: settingsData.settings.academicYear || '',
        contactEmail: settingsData.settings.contactEmail || '',
        contactPhone: settingsData.settings.contactPhone || '',
        address: settingsData.settings.address || '',
      });
    }
  }, [settingsData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    try {
      await updateSystemSettings(formData).unwrap();
      setFeedback({ type: 'success', message: 'System settings updated successfully!' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.data?.message || 'Failed to update settings. Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <InfinityLoader size={100} text="Loading system settings..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 3, mb: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Failed to load system settings. {error.data?.message || 'Please check your connection.'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 1, maxWidth: 800 }}>
      {/* Page Header */}
      <Box display="flex" alignItems="center" gap={1.5} mb={4}>
        <SettingsIcon sx={{ color: '#0ea5e9', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            System Settings
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Configure default institute name, session calendar, and compliance policies.
          </Typography>
        </Box>
      </Box>

      {/* Alerts */}
      {alertMsg.text && (
        <Box mb={4}>
          <Alert severity={alertMsg.type} onClose={() => setAlertMsg({ type: '', text: '' })} sx={{ borderRadius: 2 }}>
            {alertMsg.text}
          </Alert>
        </Box>
      )}

      {/* Configuration Card */}
      <Card
        sx={{
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.01)',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleFormSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                  Institution Information
                </Typography>
                <TextField
                  name="collegeName"
                  label="College Name"
                  fullWidth
                  required
                  value={formData.collegeName}
                  onChange={handleChange}
                  size="small"
                  helperText="This title is used across all receipts, dynamic headers, and reports."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                  Academic Cycle
                </Typography>
                <TextField
                  name="sessionYear"
                  label="Current Session Year"
                  fullWidth
                  required
                  placeholder="e.g. 2026-2027"
                  value={formData.sessionYear}
                  onChange={handleChange}
                  size="small"
                  helperText="e.g. 2026-2027"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                  Attendance Requirement (%)
                </Typography>
                <TextField
                  name="attendanceThreshold"
                  label="Minimum Threshold"
                  type="number"
                  fullWidth
                  required
                  value={formData.attendanceThreshold}
                  onChange={handleChange}
                  size="small"
                  inputProps={{ min: 0, max: 100 }}
                  helperText="Minimum attendance required to qualify for final semester examinations."
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isUpdating}
                  startIcon={<SaveIcon />}
                  sx={{
                    backgroundColor: '#0ea5e9',
                    boxShadow: 'none',
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 3,
                    py: 1,
                    '&:hover': { backgroundColor: '#0284c7', boxShadow: 'none' },
                  }}
                >
                  {isUpdating ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Settings;
export { Settings };
