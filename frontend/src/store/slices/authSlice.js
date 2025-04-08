import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from "@/lib/axiosInstance.js";

export const getUserData = createAsyncThunk(
  'auth/getUserData',
  async (_, { rejectWithValue }) => {
    try {
      const { data: userData } = await axiosInstance.get(`/users/me`);
      return userData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const { data: loginData } = await axiosInstance.post(`/login`, { email, password });
      const token = loginData?.token;

      localStorage.setItem('token', token);

      await dispatch(getUserData());

      return token;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, surname, phone, email, password, userTypeId }, { dispatch, rejectWithValue }) => {
    try {
      const { data: loginData } = await axiosInstance.post(`/users`, {
        name,
        surname,
        phone,
        email,
        password,
        userTypeId
      });
      const token = loginData?.token;

      localStorage.setItem('token', token);

      await dispatch(getUserData());

      return token;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  error: null,
  loading: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state, { payload }) => {
      const { redirectTo } = payload;

      localStorage.removeItem('token');

      state = { ...initialState }

      if (redirectTo) {
        window.location.href = redirectTo;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.token = payload
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.token = payload
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
      .addCase(getUserData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserData.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload
      })
      .addCase(getUserData.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
  }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer