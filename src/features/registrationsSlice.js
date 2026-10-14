import { createSlice } from '@reduxjs/toolkit';
import { load } from '../utils/storage';

// byUser: { [email]: [event, ...] } - a snapshot of each registered event
const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: { byUser: load('ems_registrations', {}) },
  reducers: {
    registerForEvent(state, { payload: { email, event } }) {
      if (!state.byUser[email]) state.byUser[email] = [];
      if (!state.byUser[email].some((e) => e.id === event.id)) {
        state.byUser[email].push(event);
      }
    },
    cancelRegistration(state, { payload: { email, id } }) {
      state.byUser[email] = (state.byUser[email] || []).filter((e) => e.id !== id);
    },
  },
});

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions;
export default registrationsSlice.reducer;
