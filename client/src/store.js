import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import { adminApi } from './features/adminApi';
import { feesApi } from './features/feesApi';
import { attendanceApi } from './features/attendanceApi';
import { resultsApi } from './features/resultsApi';
import { libraryApi } from './features/libraryApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [feesApi.reducerPath]: feesApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [resultsApi.reducerPath]: resultsApi.reducer,
    [libraryApi.reducerPath]: libraryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminApi.middleware,
      feesApi.middleware,
      attendanceApi.middleware,
      resultsApi.middleware,
      libraryApi.middleware
    ),
});

export default store;
