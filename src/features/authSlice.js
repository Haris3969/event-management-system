import { createSlice } from '@reduxjs/toolkit';
import { load } from '../utils/storage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    users: load('ems_users', []),
    user: load('ems_session', null),
    error: null,
  },
  reducers: {
    register(state, { payload }) {
      const email = payload.email.trim().toLowerCase();
      if (state.users.some((u) => u.email === email)) {
        state.error = 'An account with this email already exists.';
        return;
      }
      const name = payload.name.trim();
      state.users.push({ name, email, password: payload.password });
      state.user = { name, email };
      state.error = null;
    },
    login(state, { payload }) {
      const email = payload.email.trim().toLowerCase();
      const found = state.users.find((u) => u.email === email && u.password === payload.password);
      if (!found) {
        state.error = 'Invalid email or password.';
        return;
      }
      state.user = { name: found.name, email: found.email };
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { register, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
