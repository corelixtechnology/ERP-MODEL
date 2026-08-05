import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const resultsApi = createApi({
  reducerPath: 'resultsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    credentials: 'include',
  }),
  tagTypes: ['Marks', 'Exams'],
  endpoints: (builder) => ({
    getMarks: builder.query({
      query: (params) => ({
        url: '/erp/marks',
        params,
      }),
      providesTags: ['Marks'],
    }),
    getExams: builder.query({
      query: () => '/erp/exams',
      providesTags: ['Exams'],
    }),
  }),
});

export const {
  useGetMarksQuery,
  useGetExamsQuery,
} = resultsApi;
