import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from '../utils/baseQuery.js';

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Attendance'],
  endpoints: (builder) => ({
    getAttendance: builder.query({
      query: (params) => ({
        url: '/erp/attendance',
        params,
      }),
      providesTags: ['Attendance'],
    }),
    markAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: '/erp/attendance',
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useMarkAttendanceMutation,
} = attendanceApi;
