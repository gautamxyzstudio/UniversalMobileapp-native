import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  ICandidateListTypes,
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
  candidateList: [],
};

const clientSlice = createSlice({
  name: 'CLIENT',
  initialState,
  reducers: {
    saveOpenJobs: (
      state,
      action: PayloadAction<{jobs: IJobPostTypes[]; pageNo: number}>,
    ) => {
      state.candidateList = [];
      state.jobs.open = [...action.payload.jobs];
      action.payload.jobs.forEach(job => {
        const candidateItem: ICandidateListTypes = {
          details: {
            jobId: job?.id ?? 0,
            jobName: job?.job_name ?? '',
            jobPoster: null,
            eventDate: job.eventDate ?? new Date(),
            location: job.location ?? '',
          },
          open: new Map<number, ICandidateTypes>(), // Initially empty
          shortlisted: new Map<number, ICandidateTypes>(), // Initially empty
          denied: new Map<number, ICandidateTypes>(), // Initially empty
        };
        state.candidateList.push(candidateItem);
      });
    },
    saveClosedJobs: (
      state,
      action: PayloadAction<{jobs: IJobPostTypes[]; pageNo: number}>,
    ) => {
      if (action.payload.pageNo === 1) {
        state.jobs.closed = [...action.payload.jobs];
      } else {
        state.jobs.closed = [...state.jobs.closed, ...action.payload.jobs];
      }
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
      const candidateItem: ICandidateListTypes = {
        details: {
          jobId: action.payload?.id ?? 0,
          jobName: action.payload?.job_name ?? '',
          jobPoster: null,
          eventDate: action.payload.eventDate ?? new Date(),
          location: action.payload.location ?? '',
        },
        open: new Map<number, ICandidateTypes>(),
        shortlisted: new Map<number, ICandidateTypes>(),
        denied: new Map<number, ICandidateTypes>(),
      };
      state.candidateList.push(candidateItem);
    },
    postADraft: (state, action: PayloadAction<IJobPostTypes>) => {
      const draftIndex = state.jobs.drafts.findIndex(
        draft => draft.id === action.payload.id,
      );
      if (draftIndex !== -1) {
        state.jobs.drafts.splice(draftIndex, 1);
        state.jobs.open.unshift(action.payload);
        const candidateItem: ICandidateListTypes = {
          details: {
            jobId: action.payload?.id ?? 0,
            jobName: action.payload?.job_name ?? '',
            jobPoster: null,
            eventDate: action.payload.eventDate ?? new Date(),
            location: action.payload.location ?? '',
          },
          open: new Map<number, ICandidateTypes>(),
          shortlisted: new Map<number, ICandidateTypes>(),
          denied: new Map<number, ICandidateTypes>(),
        };
        state.candidateList.push(candidateItem);
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
      let candidateList = [...state.candidateList];
      const jobIndex = candidateList.findIndex(
        job => job.details.jobId === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let openJobsMap = new Map<number, ICandidateTypes>();
        action.payload.candidates.forEach(candidate => {
          openJobsMap.set(candidate.id, candidate);
        });

        candidateList[jobIndex] = {
          ...candidateList[jobIndex],
          open: openJobsMap,
          shortlisted: candidateList[jobIndex]?.shortlisted ?? null,
          denied: candidateList[jobIndex]?.denied ?? null,
        };
        state.candidateList = candidateList;
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
      let candidateList = [...state.candidateList];
      const jobIndex = candidateList.findIndex(
        job => job.details.jobId === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let shortlistedCandidatesMap = new Map<number, ICandidateTypes>();
        action.payload.candidates.forEach(candidate => {
          shortlistedCandidatesMap.set(candidate.id, candidate);
        });

        candidateList[jobIndex] = {
          ...candidateList[jobIndex],
          open: candidateList[jobIndex]?.open ?? null,
          shortlisted: shortlistedCandidatesMap ?? null,
          denied: candidateList[jobIndex]?.denied ?? null,
        };
        state.candidateList = candidateList;
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
      let candidateList = [...state.candidateList];
      const jobIndex = candidateList.findIndex(
        job => job.details.jobId === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let declinedCandidatesMap = new Map<number, ICandidateTypes>();
        action.payload.candidates.forEach(candidate => {
          declinedCandidatesMap.set(candidate.id, candidate);
        });
        candidateList[jobIndex] = {
          ...candidateList[jobIndex],
          open: candidateList[jobIndex]?.open ?? null,
          shortlisted: candidateList[jobIndex]?.shortlisted ?? null,
          denied: declinedCandidatesMap ?? null,
        };
        state.candidateList = candidateList;
      }
    },
    confirmCandidate: (
      state,
      action: PayloadAction<{applicant: ICandidateTypes; jobId: number}>,
    ) => {
      let candidateList = [...state.candidateList];
      const jobIndex = candidateList.findIndex(
        job => job.details.jobId === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let openApplicantsMap = new Map(candidateList[jobIndex].open);
        let shortlistedCandidatesMap = new Map(
          candidateList[jobIndex].shortlisted,
        );
        if (openApplicantsMap.has(action.payload.applicant.id)) {
          openApplicantsMap.delete(action.payload.applicant.id);
          shortlistedCandidatesMap.set(
            action.payload.applicant.id,
            action.payload.applicant,
          );

          candidateList[jobIndex] = {
            ...candidateList[jobIndex],
            open: openApplicantsMap,
            shortlisted: shortlistedCandidatesMap,
            denied: candidateList[jobIndex]?.denied ?? null,
          };
          state.candidateList = candidateList;
        } else {
          console.log('job Index was minus one');
        }
      }
    },
    declineCandidate: (
      state,
      action: PayloadAction<{applicant: ICandidateTypes; jobId: number}>,
    ) => {
      let candidateList = [...state.candidateList];
      const jobIndex = candidateList.findIndex(
        job => job.details.jobId === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let openApplicantsMap = new Map(candidateList[jobIndex].open);
        let declinedCandidatesMap = new Map(candidateList[jobIndex].denied);
        if (openApplicantsMap.has(action.payload.applicant.id)) {
          openApplicantsMap.delete(action.payload.applicant.id);
          declinedCandidatesMap.set(
            action.payload.applicant.id,
            action.payload.applicant,
          );
          candidateList[jobIndex] = {
            ...candidateList[jobIndex],
            open: openApplicantsMap,
            shortlisted: candidateList[jobIndex]?.shortlisted ?? null,
            denied: declinedCandidatesMap,
          };
          state.candidateList = candidateList;
        } else {
          console.log('job Index was minus one');
        }
      }
    },
    removeFromShortlisted: (
      state,
      action: PayloadAction<{applicant: ICandidateTypes; jobId: number}>,
    ) => {
      let candidateList = [...state.candidateList];
      const jobIndex = candidateList.findIndex(
        job => job.details.jobId === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        let openApplicantsMap = new Map(candidateList[jobIndex].open);
        let shortlistedApplicantsMap = new Map(
          candidateList[jobIndex].shortlisted,
        );
        if (shortlistedApplicantsMap.has(action.payload.applicant.id)) {
          shortlistedApplicantsMap.delete(action.payload.applicant.id);
          openApplicantsMap.set(
            action.payload.applicant.id,
            action.payload.applicant,
          );
          candidateList[jobIndex] = {
            ...candidateList[jobIndex],
            open: openApplicantsMap,
            shortlisted: shortlistedApplicantsMap,
            denied: candidateList[jobIndex]?.denied ?? null,
          };
          state.candidateList = candidateList;
        }
      }
    },
    declineShortlistedCandidate: (
      state,
      action: PayloadAction<{applicant: ICandidateTypes; jobId: number}>,
    ) => {
      // Work with candidateList
      let candidateList = [...state.candidateList];
      const jobIndex = candidateList.findIndex(
        job => job.details.jobId === action.payload.jobId,
      );

      if (jobIndex !== -1) {
        let deniedApplicantsMap = new Map(candidateList[jobIndex].denied);
        let shortlistedApplicantsMap = new Map(
          candidateList[jobIndex].shortlisted,
        );

        // If the applicant is in the shortlisted map, move them to the denied map
        if (shortlistedApplicantsMap.has(action.payload.applicant.id)) {
          shortlistedApplicantsMap.delete(action.payload.applicant.id);
          deniedApplicantsMap.set(
            action.payload.applicant.id,
            action.payload.applicant,
          );

          // Update the candidate list for this job
          candidateList[jobIndex] = {
            ...candidateList[jobIndex],
            denied: deniedApplicantsMap,
            shortlisted: shortlistedApplicantsMap,
            open: candidateList[jobIndex]?.open ?? null, // Keep open as is
          };

          // Update the state with the modified candidateList
          state.candidateList = candidateList;
        }
      }
    },

    stopAJobPostReducer: (state, action: PayloadAction<{jobId: number}>) => {
      let openJobs = [...state.jobs.open];
      const jobIndex = openJobs.findIndex(
        job => job.id === action.payload.jobId,
      );
      if (jobIndex !== -1) {
        openJobs[jobIndex].notAccepting = true;
      }
      state.jobs.open = openJobs;
    },
    restoreDeclinedCandidate: (
      state,
      action: PayloadAction<{applicant: ICandidateTypes; jobId: number}>,
    ) => {
      // Work with candidateList
      let candidateList = [...state.candidateList];
      const jobIndex = candidateList.findIndex(
        job => job.details.jobId === action.payload.jobId,
      );

      if (jobIndex !== -1) {
        let declinedApplicantsMap = new Map(candidateList[jobIndex].denied);
        let openApplicantsMap = new Map(candidateList[jobIndex].open);

        // If the applicant is in the denied map, restore them to the open map
        if (declinedApplicantsMap.has(action.payload.applicant.id)) {
          declinedApplicantsMap.delete(action.payload.applicant.id);
          openApplicantsMap.set(
            action.payload.applicant.id,
            action.payload.applicant,
          );

          // Update the candidate list for this job
          candidateList[jobIndex] = {
            ...candidateList[jobIndex],
            open: openApplicantsMap,
            shortlisted: candidateList[jobIndex]?.shortlisted ?? null, // Keep shortlisted as is
            denied: declinedApplicantsMap,
          };

          // Update the state with the modified candidateList
          state.candidateList = candidateList;
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
  confirmCandidate,
  updateOpenApplication,
  declineShortlistedCandidate,
  updateShortlistedApplication,
  saveOpenJobs,
  postADraft,
  updateDraftReducer,
  stopAJobPostReducer,
} = clientSlice.actions;

//state extractors
export const openJobsFromState = (state: RootState) => state.client.jobs.open;
export const closedJobsFromState = (state: RootState) =>
  state.client.jobs.closed;
export const jobDraftFromState = (state: RootState) => state.client.jobs.drafts;
export const candidateListFromState = (state: RootState) =>
  state.client.candidateList;
