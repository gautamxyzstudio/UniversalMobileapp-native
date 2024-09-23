import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  ICandidateListTypes,
  IClientSliceInitialState,
  IJobPostTypes,
} from './types';
import {RootState} from '@api/store';

const initialState: IClientSliceInitialState = {
  jobs: {
    open: [],
    closed: [],
    drafts: [],
  },
  candidateList: new Map(),
};

const clientSlice = createSlice({
  name: 'CLIENT',
  initialState,
  reducers: {
    saveOpenJobs: (state, action) => {
      state.jobs.open = [...action.payload];
    },
    saveClosedJobs: (state, action) => {
      state.jobs.open = [...state.jobs.closed, ...action.payload];
    },
    saveDrafts: (state, action: PayloadAction<IJobPostTypes[]>) => {
      state.jobs.drafts = [...action.payload];
    },
    removeADraft: (state, action: PayloadAction<{id: number}>) => {
      const draftIndex = state.jobs.drafts.findIndex(
        draft => draft.id === action.payload.id,
      );
      if (draftIndex !== -1) {
        state.jobs.drafts.splice(draftIndex, 1);
      }
    },
    addNewJob: (state, action: PayloadAction<IJobPostTypes>) => {
      state.jobs.open.unshift(action.payload);
    },
    postADraft: (state, action: PayloadAction<IJobPostTypes>) => {
      const draftIndex = state.jobs.drafts.findIndex(
        draft => draft.id === action.payload.id,
      );
      if (draftIndex !== -1) {
        state.jobs.drafts.splice(draftIndex, 1);
        state.jobs.open.unshift(action.payload);
      }
    },
    updateDraftReducer: (state, action: PayloadAction<IJobPostTypes>) => {
      const draftIndex = state.jobs.drafts.findIndex(
        draft => draft.id === action.payload.id,
      );
      if (draftIndex !== -1) {
        state.jobs.drafts[draftIndex] = {...action.payload};
      }
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
    addNewDraft: (state, action: PayloadAction<IJobPostTypes>) => {
      state.jobs.drafts.unshift(action.payload);
    },
    initializeCandidateList: (
      state,
      action: PayloadAction<IJobPostTypes[]>,
    ) => {
      let candidateListMap = new Map<number, ICandidateListTypes>();
      action.payload.forEach((job: IJobPostTypes) => {
        console.log(job, 'MAP JOB');
        candidateListMap.set(job.id, {
          open: new Map(),
          jobDetails: job,
          shortlisted: new Map(),
          denied: new Map(),
        });
      });
      state.candidateList = new Map(candidateListMap);
    },
  },
});
export default clientSlice.reducer;
export const {
  addNewJob,
  addNewDraft,
  saveClosedJobs,
  saveDrafts,
  initializeCandidateList,
  removeADraft,
  closeAJob,
  saveOpenJobs,
  postADraft,
  updateDraftReducer,
} = clientSlice.actions;

//state extractors
export const openJobsFromState = (state: RootState) => state.client.jobs.open;
export const closedJobsFromState = (state: RootState) =>
  state.client.jobs.closed;
export const jobDraftFromState = (state: RootState) => state.client.jobs.drafts;
export const candidateListFromSate = (state: RootState) =>
  state.client.candidateList;
