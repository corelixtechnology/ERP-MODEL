import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const feesApi = createApi({
  reducerPath: 'feesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    credentials: 'include',
  }),
  tagTypes: ['Fees', 'Transactions'],
  endpoints: (builder) => ({
    getStudentFees: builder.query({
      query: () => '/fees/students',
      providesTags: ['Fees'],
    }),
    getMyFees: builder.query({
      query: (studentUserId) => ({
        url: '/fees/my-fees',
        params: studentUserId ? { studentUserId } : undefined,
      }),
      providesTags: ['Fees', 'Transactions'],
    }),
    updateStudentFees: builder.mutation({
      query: ({ id, ...feeData }) => ({
        url: `/fees/students/${id}`,
        method: 'PUT',
        body: feeData,
      }),
      invalidatesTags: ['Fees', 'Transactions'],
    }),
    recordFeePayment: builder.mutation({
      query: (paymentData) => ({
        url: '/fees/pay',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Fees', 'Transactions'],
    }),
    getFeeTransactions: builder.query({
      query: () => '/fees/transactions',
      providesTags: ['Transactions'],
    }),
  }),
});

export const {
  useGetStudentFeesQuery,
  useGetMyFeesQuery,
  useUpdateStudentFeesMutation,
  useRecordFeePaymentMutation,
  useGetFeeTransactionsQuery,
} = feesApi;
