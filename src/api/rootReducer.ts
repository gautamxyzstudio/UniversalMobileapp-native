import {Reducer, combineReducers} from '@reduxjs/toolkit';
import loadingSlice from './features/loading/loadingSlice';
import {ILoadingInitialState} from './features/loading/types';
import userSlice from './features/user/userSlice';
import clientSlice from './features/client/clientSlice';
import employeeSlice from './features/employee/employeeSlice';
import {IUserSliceInitialState} from './features/user/types';
import {baseApi} from './baseApi';
import {IClientSliceInitialState} from './features/client/types';
import {IEmployeeSliceInitialState} from './features/employee/types';

const combineReducer = combineReducers<IState>({
  [baseApi.reducerPath]: baseApi.reducer,
  loading: loadingSlice,
  user: userSlice,
  client: clientSlice,
  employee: employeeSlice,
});

//state type definitions
export interface IState {
  loading: Reducer<ILoadingInitialState>;
  user: Reducer<IUserSliceInitialState>;
  client: Reducer<IClientSliceInitialState>;
  employee: Reducer<IEmployeeSliceInitialState>;
  [key: string]: Reducer;
}

// reducer with  dehydrating  state capabilities
const rootReducer = (state: any, action: {type: string}) => {
  if (action.type === 'RESET') {
    state = undefined;
  }
  return combineReducer(state, action);
};
export default rootReducer;
