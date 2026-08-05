import React from 'react';
import { Box, Typography } from '@mui/material';

const InfinityLoader = ({
  size = 130,
  color = '#00e5ff',
  trackColor = '#181829',
  strokeWidth = 15,
  speed = 1.8,
  text = '',
  textColor = '#94a3b8',
  fullScreen = false,
}) => {
  // SVG viewBox is 200 x 100 (2:1 aspect ratio)
  const width = size;
  const height = size / 2;

  const pathD = "M 100,50 C 70,10 20,10 20,50 C 20,90 70,90 100,50 C 130,10 180,10 180,50 C 180,90 130,90 100,50 Z";

  const loaderContent = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <style>{`
        @keyframes infinityDash {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          filter: 'drop-shadow(0px 0px 8px rgba(0, 229, 255, 0.4))',
        }}
      >
        {/* Background dark track */}
        <path
          d={pathD}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated cyan moving segment */}
        <path
          d={pathD}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="100"
          strokeDasharray="28 72"
          style={{
            animation: `infinityDash ${speed}s linear infinite`,
          }}
        />
      </svg>
      {text && (
        <Typography
          variant="body1"
          sx={{
            mt: 2.5,
            color: textColor,
            fontWeight: 600,
            letterSpacing: '0.5px',
            fontSize: '0.95rem',
            textAlign: 'center',
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#0b0f19',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
        }}
      >
        {loaderContent}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {loaderContent}
    </Box>
  );
};

export default InfinityLoader;
