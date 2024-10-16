import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {IEmployeeSliceInitialState, IJobTypes} from './types';
import {RootState} from '@api/store';
const initialState: IEmployeeSliceInitialState = {
  jobs: [],
  myJobs: [],
};

const employeeSlice = createSlice({
  name: 'Employee',
  initialState,
  reducers: {
    updateJobs: (
      state,
      action: PayloadAction<{
        currentPage: number;
        jobs: IJobTypes[];
        detailsId: number;
      }>,
    ) => {
      const jobs = action.payload.jobs.filter(job => {
        return !job.job_applications?.some(
          jobApplication =>
            jobApplication?.employee_details[0]?.id ===
            action.payload.detailsId,
        );
      });

      if (action.payload.currentPage > 1) {
        state.jobs = [...state.jobs, ...jobs];
      } else {
        state.jobs = [...jobs];
      }
    },
    updateAppliedJobs: (state, action: PayloadAction<IJobTypes[]>) => {
      state.myJobs = [...action.payload];
    },
    applyJobAction: (state, action: PayloadAction<IJobTypes>) => {
      let current_job_index = state.jobs.findIndex(
        j => j.id === action.payload.id,
      );
      if (current_job_index !== -1) {
        state.jobs[current_job_index] = {
          ...action.payload,
        };

        state.myJobs.unshift(action.payload);
      }
    },
  },
});

export default employeeSlice.reducer;
export const {updateJobs, applyJobAction, updateAppliedJobs} =
  employeeSlice.actions;

export const jobsFromState = (state: RootState) => state.employee.jobs;
export const appliedJobsFromState = (state: RootState) => state.employee.myJobs;
