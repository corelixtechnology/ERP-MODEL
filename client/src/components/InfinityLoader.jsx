import React from 'react';
import { Box, Typography } from '@mui/material';

const InfinityLoader = ({
  size = 120,
  color = '#00e5ff',
  trackColor = '#181829',
  strokeWidth = 15,
  speed = 1.8,
  text = '',
  textColor = '#475569',
}) => {
  // SVG viewBox is 200 x 100 (2:1 aspect ratio)
  const width = size;
  const height = size / 2;

  const pathD = "M 100,50 C 70,10 20,10 20,50 C 20,90 70,90 100,50 C 130,10 180,10 180,50 C 180,90 130,90 100,50 Z";

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
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
        style={{ display: 'block' }}
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
          variant="body2"
          sx={{
            mt: 2,
            color: textColor,
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default InfinityLoader;
