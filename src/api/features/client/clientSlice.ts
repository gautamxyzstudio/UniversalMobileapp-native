import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  ICandidateTypes,
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

    updateOpenApplication: (
      state,
      action: PayloadAction<{
        jobId: number;
        candidates: ICandidateTypes[];
        pageNumber: number;
      }>,
    ) => {
      let openJobs = [...state.jobs.open];
      const jobIndex = openJobs.findIndex(
        job => job.id === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let openJobsMap = new Map<number, ICandidateTypes>();
        action.payload.candidates.forEach(candidate => {
          openJobsMap.set(candidate.id, candidate);
        });
        openJobs[jobIndex] = {
          ...openJobs[jobIndex],
          applicants: {
            open: openJobsMap,
            shortlisted: openJobs[jobIndex].applicants?.shortlisted ?? null,
            denied: openJobs[jobIndex].applicants?.denied ?? null,
          },
        };
        state.jobs.open = openJobs;
      }
    },
    updateShortlistedApplication: (
      state,
      action: PayloadAction<{
        jobId: number;
        candidates: ICandidateTypes[];
        pageNumber: number;
      }>,
    ) => {
      let openJobs = [...state.jobs.open];
      const jobIndex = openJobs.findIndex(
        job => job.id === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let shortlistedCandidatesMap = new Map<number, ICandidateTypes>();
        action.payload.candidates.forEach(candidate => {
          shortlistedCandidatesMap.set(candidate.id, candidate);
        });
        openJobs[jobIndex] = {
          ...openJobs[jobIndex],
          applicants: {
            open: openJobs[jobIndex].applicants?.open ?? null,
            shortlisted: shortlistedCandidatesMap,
            denied: openJobs[jobIndex].applicants?.denied ?? null,
          },
        };
        state.jobs.open = openJobs;
      }
    },
    updateDeclinedApplications: (
      state,
      action: PayloadAction<{
        jobId: number;
        candidates: ICandidateTypes[];
        pageNumber: number;
      }>,
    ) => {
      let openJobs = [...state.jobs.open];
      const jobIndex = openJobs.findIndex(
        job => job.id === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let declinedCandidatesMap = new Map<number, ICandidateTypes>();
        action.payload.candidates.forEach(candidate => {
          declinedCandidatesMap.set(candidate.id, candidate);
        });
        openJobs[jobIndex] = {
          ...openJobs[jobIndex],
          applicants: {
            open: openJobs[jobIndex].applicants?.open ?? null,
            shortlisted: openJobs[jobIndex].applicants?.shortlisted ?? null,
            denied: declinedCandidatesMap,
          },
        };
        state.jobs.open = openJobs;
      }
    },
    confirmCandidate: (
      state,
      action: PayloadAction<{applicant: ICandidateTypes; jobId: number}>,
    ) => {
      let openJobs = [...state.jobs.open];
      const jobIndex = openJobs.findIndex(
        job => job.id === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let openApplicantsMap = new Map(openJobs[jobIndex].applicants?.open);
        let shortlistedCandidatesMap = new Map(
          openJobs[jobIndex].applicants?.shortlisted,
        );
        if (openApplicantsMap.has(action.payload.applicant.id)) {
          openApplicantsMap.delete(action.payload.applicant.id);
          shortlistedCandidatesMap.set(
            action.payload.applicant.id,
            action.payload.applicant,
          );
          openJobs[jobIndex].applicants = {
            open: openApplicantsMap,
            shortlisted: shortlistedCandidatesMap,
            denied: openJobs[jobIndex].applicants?.denied ?? null,
          };
        }
        state.jobs.open = openJobs;
      } else {
        console.log('job Index was minus one');
      }
    },
    declineCandidate: (
      state,
      action: PayloadAction<{applicant: ICandidateTypes; jobId: number}>,
    ) => {
      let openJobs = [...state.jobs.open];
      const jobIndex = openJobs.findIndex(
        job => job.id === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let openApplicantsMap = new Map(openJobs[jobIndex].applicants?.open);
        let declinedCandidatesMap = new Map(
          openJobs[jobIndex].applicants?.denied,
        );
        if (openApplicantsMap.has(action.payload.applicant.id)) {
          openApplicantsMap.delete(action.payload.applicant.id);
          declinedCandidatesMap.set(
            action.payload.applicant.id,
            action.payload.applicant,
          );
          openJobs[jobIndex].applicants = {
            open: openApplicantsMap,
            shortlisted: openJobs[jobIndex].applicants?.shortlisted ?? null,
            denied: declinedCandidatesMap,
          };
        }
        state.jobs.open = openJobs;
      } else {
        console.log('job Index was minus one');
      }
    },
    removeFromShortlisted: (
      state,
      action: PayloadAction<{applicant: ICandidateTypes; jobId: number}>,
    ) => {
      let openJobs = [...state.jobs.open];
      const jobIndex = openJobs.findIndex(
        job => job.id === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let openApplicantsMap = new Map(openJobs[jobIndex].applicants?.open);
        let confirmedApplicantsMap = new Map(
          openJobs[jobIndex].applicants?.shortlisted,
        );
        if (confirmedApplicantsMap.has(action.payload.applicant.id)) {
          confirmedApplicantsMap.delete(action.payload.applicant.id);
          openApplicantsMap.set(
            action.payload.applicant.id,
            action.payload.applicant,
          );
          openJobs[jobIndex].applicants = {
            open: openApplicantsMap,
            shortlisted: confirmedApplicantsMap,
            denied: openJobs[jobIndex].applicants?.denied ?? null,
          };
          state.jobs.open = openJobs;
        }
      }
    },
    declineShortlistedCandidate: (
      state,
      action: PayloadAction<{applicant: ICandidateTypes; jobId: number}>,
    ) => {
      let openJobs = [...state.jobs.open];
      const jobIndex = openJobs.findIndex(
        job => job.id === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let declinedApplicantsMap = new Map(
          openJobs[jobIndex].applicants?.denied,
        );
        let confirmedApplicantsMap = new Map(
          openJobs[jobIndex].applicants?.shortlisted,
        );
        if (confirmedApplicantsMap.has(action.payload.applicant.id)) {
          confirmedApplicantsMap.delete(action.payload.applicant.id);
          declinedApplicantsMap.set(
            action.payload.applicant.id,
            action.payload.applicant,
          );
          openJobs[jobIndex].applicants = {
            open: openJobs[jobIndex].applicants?.open ?? null,
            shortlisted: confirmedApplicantsMap,
            denied: declinedApplicantsMap,
          };
          state.jobs.open = openJobs;
        }
      }
    },
    restoreDeclinedCandidate: (
      state,
      action: PayloadAction<{applicant: ICandidateTypes; jobId: number}>,
    ) => {
      let openJobs = [...state.jobs.open];
      const jobIndex = openJobs.findIndex(
        job => job.id === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let declinedApplicantsMap = new Map(
          openJobs[jobIndex].applicants?.denied,
        );
        let openApplicantsMap = new Map(openJobs[jobIndex].applicants?.open);
        if (declinedApplicantsMap.has(action.payload.applicant.id)) {
          declinedApplicantsMap.delete(action.payload.applicant.id);
          openApplicantsMap.set(
            action.payload.applicant.id,
            action.payload.applicant,
          );
          openJobs[jobIndex].applicants = {
            open: openApplicantsMap,
            shortlisted: openJobs[jobIndex].applicants?.shortlisted ?? null,
            denied: declinedApplicantsMap,
          };
          state.jobs.open = openJobs;
        }
      }
    },
  },
});
export default clientSlice.reducer;
export const {
  addNewJob,
  addNewDraft,
  removeFromShortlisted,
  declineCandidate,
  restoreDeclinedCandidate,
  saveClosedJobs,
  saveDrafts,
  removeADraft,
  updateDeclinedApplications,
  closeAJob,
  confirmCandidate,
  updateOpenApplication,
  declineShortlistedCandidate,
  updateShortlistedApplication,
  saveOpenJobs,
  postADraft,
  updateDraftReducer,
} = clientSlice.actions;

//state extractors
export const openJobsFromState = (state: RootState) => state.client.jobs.open;
export const closedJobsFromState = (state: RootState) =>
  state.client.jobs.closed;
export const jobDraftFromState = (state: RootState) => state.client.jobs.drafts;
