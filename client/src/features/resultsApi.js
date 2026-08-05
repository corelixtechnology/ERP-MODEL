import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from '../utils/baseQuery.js';

export const resultsApi = createApi({
  reducerPath: 'resultsApi',
  baseQuery: dynamicBaseQuery,
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
