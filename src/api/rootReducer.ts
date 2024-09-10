import {Reducer, combineReducers} from '@reduxjs/toolkit';
import loadingSlice from './features/loading/loadingSlice';
import {ILoadingInitialState} from './features/loading/types';
import userSlice from './features/user/userSlice';

import {IUserSliceInitialState} from './features/user/types';
import {baseApi} from './baseApi';

const combineReducer = combineReducers<IState>({
  [baseApi.reducerPath]: baseApi.reducer,
  loading: loadingSlice,
  user: userSlice,
});

//state type definitions
export interface IState {
  loading: Reducer<ILoadingInitialState>;
  user: Reducer<IUserSliceInitialState>;

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
