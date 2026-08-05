import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    credentials: 'include',
  }),
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
