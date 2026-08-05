import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from '../utils/baseQuery.js';

export const libraryApi = createApi({
  reducerPath: 'libraryApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['LibraryBooks'],
  endpoints: (builder) => ({
    getLibraryBooks: builder.query({
      query: () => '/erp/library',
      providesTags: ['LibraryBooks'],
    }),
    createLibraryBook: builder.mutation({
      query: (bookData) => ({
        url: '/erp/library',
        method: 'POST',
        body: bookData,
      }),
      invalidatesTags: ['LibraryBooks'],
    }),
  }),
});

export const {
  useGetLibraryBooksQuery,
  useCreateLibraryBookMutation,
} = libraryApi;
