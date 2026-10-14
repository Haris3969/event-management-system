import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import eventsReducer from '../features/eventsSlice';
import registrationsReducer from '../features/registrationsSlice';
import { save } from '../utils/storage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
  },
});

// Persist auth and registrations so they survive a page refresh
store.subscribe(() => {
  const { auth, registrations } = store.getState();
  save('ems_users', auth.users);
  save('ems_session', auth.user);
  save('ems_registrations', registrations.byUser);
});
