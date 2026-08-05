import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    credentials: 'include', // Crucial for cookie transmission
  }),
  tagTypes: ['DashboardStats', 'Users', 'Courses', 'Settings', 'Faculty'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard',
      providesTags: ['DashboardStats'],
    }),
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, role = '', search = '' }) => ({
        url: '/admin/users',
        params: { page, limit, role, search },
      }),
      providesTags: ['Users'],
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/admin/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users', 'DashboardStats', 'Faculty'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['Users', 'DashboardStats', 'Faculty'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'DashboardStats', 'Faculty'],
    }),
    getCourses: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/admin/courses',
        params: { page, limit },
      }),
      providesTags: ['Courses'],
    }),
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: '/admin/courses',
        method: 'POST',
        body: courseData,
      }),
      invalidatesTags: ['Courses', 'DashboardStats'],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...courseData }) => ({
        url: `/admin/courses/${id}`,
        method: 'PUT',
        body: courseData,
      }),
      invalidatesTags: ['Courses', 'DashboardStats'],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/admin/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses', 'DashboardStats'],
    }),
    getSystemSettings: builder.query({
      query: () => '/admin/settings',
      providesTags: ['Settings'],
    }),
    updateSystemSettings: builder.mutation({
      query: (settingsData) => ({
        url: '/admin/settings',
        method: 'PUT',
        body: settingsData,
      }),
      invalidatesTags: ['Settings'],
    }),
    getFacultyUsers: builder.query({
      query: () => ({
        url: '/admin/users',
        params: { role: 'faculty', limit: 100 },
      }),
      providesTags: ['Faculty'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useGetFacultyUsersQuery,
} = adminApi;
