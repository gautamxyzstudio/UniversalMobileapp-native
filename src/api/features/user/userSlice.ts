import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  IClientDetails,
  IEmployeeDetails,
  IEmployeeDocument,
  IUser,
  IUserSliceInitialState,
} from './types';
import {RootState} from '@api/store';

const initialState: IUserSliceInitialState = {
  user: null,
  isEmailVerified: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUserDetails: (state, action) => {
      const prevDetails = {...state.user};
      state.user = {...prevDetails, ...action.payload};
    },
    updateEmployeeDetails: (state, action: PayloadAction<IEmployeeDetails>) => {
      let employee = {...(state.user as IUser<'emp'>)};
      const employeeDetails = {...state.user?.details, ...action.payload};
      employee = {...employee, details: employeeDetails};
      state.user = employee;
    },
    updateEmployeeResume: (state, action: PayloadAction<IEmployeeDocument>) => {
      const employee = {...(state.user as IUser<'emp'>)};
      if (employee.details) {
        employee.details.resume = action.payload;
      }
    },
    addNewDocumentEmployee: (
      state,
      action: PayloadAction<{
        document: IEmployeeDocument;
        type: 'primary' | 'secondary';
      }>,
    ) => {
      const employee = {...(state.user as IUser<'emp'>)};
      if (employee) {
        const empDocs = employee.details?.documents;
        if (empDocs && action.payload.type === 'primary' && empDocs.primary) {
          empDocs.primary.push(action.payload.document);
        }
        if (
          empDocs &&
          action.payload.type === 'secondary' &&
          empDocs.secondary
        ) {
          empDocs.secondary.push(action.payload.document);
        }
      }
      state.user = employee;
    },
    updateClientDetails: (state, action: PayloadAction<IClientDetails>) => {
      let prevData = {...state.user?.details};
      if (state.user) {
        state.user.details = {...prevData, ...action.payload};
      }
    },
  },
});

export const {
  saveUserDetails,
  updateEmployeeDetails,
  updateEmployeeResume,
  updateClientDetails,
  addNewDocumentEmployee,
} = userSlice.actions;
export default userSlice.reducer;
export const userBasicDetailsFromState = (state: RootState) => state.user.user;
export const userAdvanceDetailsFromState = (state: RootState) =>
  state.user.user?.details;
export const isEmailVerifiedFromState = (state: RootState) =>
  state.user.isEmailVerified;
export const getUserTypeFromState = (state: RootState) =>
  state.user.user?.user_type;
