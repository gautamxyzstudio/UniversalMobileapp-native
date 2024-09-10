import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {IClientSliceInitialState, IJobPostTypes} from './types';
import {RootState} from '@api/store';

const initialState: IClientSliceInitialState = {
  jobs: {
    open: [],
    closed: [],
    drafts: [],
  },
};

const clientSlice = createSlice({
  name: 'CLIENT',
  initialState,
  reducers: {
    saveOpenJobs: (state, action) => {
      state.jobs.open = [...state.jobs.open, ...action.payload];
    },
    saveClosedJobs: (state, action) => {
      state.jobs.open = [...state.jobs.closed, ...action.payload];
    },
    saveDrafts: (state, action) => {
      state.jobs.drafts = [...state.jobs.drafts, ...action.payload];
    },
    addNewJob: (state, action: PayloadAction<IJobPostTypes>) => {
      state.jobs.open.unshift(action.payload);
    },
    closeAJob: (state, action: PayloadAction<IJobPostTypes>) => {
      const jobIndex = state.jobs.open.findIndex(
        job => job.id === action.payload.id,
      );
      if (jobIndex >= 0) {
        state.jobs.open.splice(jobIndex, 1);
        state.jobs.closed.unshift(action.payload);
      }
    },
    addNewDraft: (state, action) => {
      state.jobs.drafts.unshift(action.payload);
    },
  },
});
export default clientSlice.reducer;
export const {
  addNewJob,
  addNewDraft,
  saveClosedJobs,
  saveDrafts,
  closeAJob,
  saveOpenJobs,
} = clientSlice.actions;

//state extractors
export const openJobsFromState = (state: RootState) => state.client.jobs.open;
export const closedJobsFromState = (state: RootState) =>
  state.client.jobs.closed;
export const jobDraftFromState = (state: RootState) => state.client.jobs.drafts;
