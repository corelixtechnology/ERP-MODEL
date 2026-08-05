import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const libraryApi = createApi({
  reducerPath: 'libraryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    credentials: 'include',
  }),
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
