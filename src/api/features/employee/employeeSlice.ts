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
      action: PayloadAction<{currentPage: number; jobs: IJobTypes[]}>,
    ) => {
      if (action.payload.currentPage > 1) {
        state.jobs = [...state.jobs, ...action.payload.jobs];
      } else {
        state.jobs = [...action.payload.jobs];
      }
    },
    applyForJob: (state, action: PayloadAction<IJobTypes>) => {
      state.myJobs.push(action.payload);
    },
  },
});

export default employeeSlice.reducer;
export const {updateJobs, applyForJob} = employeeSlice.actions;

export const jobsFromState = (state: RootState) => state.employee.jobs;
