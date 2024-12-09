import {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RootState} from './store';
import {QueryReturnValue} from 'node_modules/@reduxjs/toolkit/dist/query/baseQueryTypes';
import NetInfo from '@react-native-community/netinfo';
import {resetNavigation} from 'src/navigator/types';
import {STRINGS} from 'src/locales/english';
import {IErrorResponse, transformErrorResponse} from './types';

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.BASE_URL}`,
  credentials: 'include',
  prepareHeaders: (headers, api) => {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    let token = (api.getState() as RootState).user.user?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    console.log(
      '############################## headers ######################################',
    );
    console.log('prepareHeaders', api);
    console.log('headers ------', headers);
    console.log(
      '############################## headers end ######################################',
    );
    return headers;
  },
});

const queryFetcher = async (
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions: {},
): Promise<
  QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
> => {
  console.log(
    '\n############################## Request ######################################',
    '\n API ------',
    args.url,
    '\n Api request ------',
    JSON.stringify(args),
    '\napi name ------',
    JSON.stringify(api),
  );
  console.log(
    '\n############################## Request End ######################################',
  );
  const isConnected = await NetInfo.fetch();
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    if (result.error?.status === 401) {
      resetNavigation();
    } else if (result.error.status === 'FETCH_ERROR') {
      if (isConnected.isInternetReachable || isConnected.isConnected) {
        return {
          error: {
            message: 'Server not reachable.Please try again later',
            statusCode: 10,
          } as any,
        };
      } else {
        return {
          error: {
            message: STRINGS.your_internet_is_a_little_wonky_right_now,
            statusCode: 0,
          } as any,
        };
      }
    } else if (result.error.status === 'TIMEOUT_ERROR') {
      return {
        error: {
          message: 'Server not reachable.Please try again later',
          statusCode: 10,
        } as any,
      };
    } else {
      const transformedError = transformErrorResponse(
        result?.error as IErrorResponse,
      );
      return {error: transformedError as any};
    }
  }
  console.log(
    '\n############################## Result End ######################################',
  );
  console.log(JSON.stringify(result));
  console.log(
    '\n############################## Result End ######################################',
  );

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: queryFetcher as any,
  endpoints: () => ({}),
});
