import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchEvents, getEvent } from '../api/ticketmaster';

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (params, { rejectWithValue }) => {
  try {
    return await searchEvents(params);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchEventById = createAsyncThunk('events/fetchEventById', async (id, { rejectWithValue }) => {
  try {
    return await getEvent(id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    list: [],
    page: 0,
    totalPages: 0,
    status: 'idle',
    error: null,
    selected: null,
    detailStatus: 'idle',
    detailError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.list = payload.events;
        state.page = payload.page;
        state.totalPages = payload.totalPages;
      })
      .addCase(fetchEvents.rejected, (state, { payload, error }) => {
        state.status = 'failed';
        state.error = payload || error.message;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
        state.selected = null;
      })
      .addCase(fetchEventById.fulfilled, (state, { payload }) => {
        state.detailStatus = 'succeeded';
        state.selected = payload;
      })
      .addCase(fetchEventById.rejected, (state, { payload, error }) => {
        state.detailStatus = 'failed';
        state.detailError = payload || error.message;
      });
  },
});

export default eventsSlice.reducer;
