import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  IEmployeeDetails,
  IEmployeeDocument,
  IUser,
  IUserSliceInitialState,
} from './types';
import {RootState} from '@api/store';

const initialState: IUserSliceInitialState = {
  user: null,
  preferredLocations: [],
  recentSearchesEmployee: [],
  selectedFilters: [],
  filtersDate: {
    startDate: null,
    endDate: null,
  },
  jobTypeFilter: null,
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
        type: 'primary' | 'secondary' | 'new requests';
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
        if (
          empDocs &&
          action.payload.type === 'new requests' &&
          empDocs.document_requests
        ) {
          empDocs.document_requests.push(action.payload.document);
        }
      }
      state.user = employee;
    },
    updateClientDetails: (state, action: PayloadAction<any>) => {
      let prevData = {...state.user?.details};
      if (state.user) {
        state.user.details = {...prevData, ...action.payload};
      }
    },
    addNewSearchEmployee: (state, action: PayloadAction<string>) => {
      state.recentSearchesEmployee.push(action.payload);
    },
    deleteRecentSearch: (state, action: PayloadAction<string>) => {
      const index = state.recentSearchesEmployee.indexOf(action.payload);
      if (index !== -1) {
        state.recentSearchesEmployee.splice(index, 1);
      }
    },
    addPreferredLocation: (state, action: PayloadAction<string[]>) => {
      state.preferredLocations = action.payload;
    },
    clearPreferredLocations: state => {
      state.preferredLocations = [];
    },
    removeLocation: (state, action: PayloadAction<string>) => {
      const index = state.preferredLocations.indexOf(action.payload);
      if (index !== -1) {
        state.preferredLocations.splice(index, 1);
      }
    },
    updateFilters: (state, action: PayloadAction<string[]>) => {
      state.selectedFilters = action.payload;
    },
    clearFilters: state => {
      state.selectedFilters = [];
    },
    removeFilter: (state, action: PayloadAction<string>) => {
      const index = state.selectedFilters.indexOf(action.payload);
      if (index !== -1) {
        state.selectedFilters.splice(index, 1);
      }
    },
    updateFiltersDate: (
      state,
      action: PayloadAction<{startDate: string | null; endDate: string | null}>,
    ) => {
      state.filtersDate = {
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      };
    },
    setJobType: (state, action: PayloadAction<'event' | 'static' | null>) => {
      state.jobTypeFilter = action.payload;
    },
    clearDateFilters: state => {
      state.jobTypeFilter = null;
      state.filtersDate = {startDate: null, endDate: null};
    },
    cancelDocumentRequest: (state, action: PayloadAction<{docId: number}>) => {
      const employee = {...(state.user as IUser<'emp'>)};
      if (employee.details?.documents?.document_requests) {
        const docIndex = employee.details.documents.document_requests.findIndex(
          doc => doc.doc?.id === action.payload.docId,
        );
        if (docIndex !== -1) {
          employee.details.documents.document_requests.splice(docIndex, 1);
        }
        state.user = {
          ...employee,
          details: {
            ...employee.details,
            documents: {
              ...employee.details.documents,
              document_requests: [
                ...employee.details.documents.document_requests,
              ],
            },
          },
        };
      }
    },
  },
});

export const {
  updateFilters,
  updateFiltersDate,
  cancelDocumentRequest,
  removeFilter,
  clearFilters,
  saveUserDetails,
  setJobType,
  updateEmployeeDetails,
  clearDateFilters,
  updateEmployeeResume,
  addNewSearchEmployee,
  deleteRecentSearch,
  addPreferredLocation,
  updateClientDetails,
  clearPreferredLocations,
  removeLocation,
  addNewDocumentEmployee,
} = userSlice.actions;
export default userSlice.reducer;
export const userBasicDetailsFromState = (state: RootState) => state.user.user;
export const userAdvanceDetailsFromState = (state: RootState) =>
  state.user.user?.details;

export const getUserTypeFromState = (state: RootState) =>
  state.user.user?.user_type;
export const getRecentSearchesFromStateEmployee = (state: RootState) =>
  state.user.recentSearchesEmployee;
export const getPreferredLocationsFromState = (state: RootState) =>
  state.user.preferredLocations;

export const getSelectedFiltersFromState = (state: RootState) =>
  state.user.selectedFilters;

export const getFiltersDateFromState = (state: RootState) =>
  state.user.filtersDate;

export const getJobTypeFilterFromState = (state: RootState) =>
  state.user.jobTypeFilter;
