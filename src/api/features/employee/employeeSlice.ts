import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {IEmployeeSliceInitialState, IJobTypes} from './types';
import {act} from 'react-test-renderer';
import {RootState} from '@api/store';

const initialState: IEmployeeSliceInitialState = {
  jobs: [],
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
  },
});

export default employeeSlice.reducer;
export const {updateJobs} = employeeSlice.actions;

export const jobsFromState = (state: RootState) => state.employee.jobs;
