import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import { GppBad as ShieldAlertIcon } from '@mui/icons-material';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <ShieldAlertIcon sx={{ fontSize: 80, color: '#ef4444', mb: 2 }} />
        <Typography variant="h3" fontWeight={800} gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 400 }}>
          You do not have the permission to access this page. Please contact your system administrator if you think this is a mistake.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard')}
          sx={{ px: 4, py: 1.2, fontWeight: 600 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;
export { Unauthorized };
