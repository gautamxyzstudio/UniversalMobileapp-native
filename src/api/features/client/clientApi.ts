import {apiMethodType} from '@api/apiConstants';
import {baseApi} from '@api/baseApi';
import {apiEndPoints} from '@api/endpoints';
import {IJobPostInterface} from '@screens/clientScreens/jobPosting/types';
import {
  IJobPostCustomizedResponse,
  IJobPostTypes,
  IPostedJobsResponse,
} from './types';
import {ICustomErrorResponse, IErrorResponse} from '@api/types';
import {STRINGS} from 'src/locales/english';

const baseApiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['PostedJobs'],
});

const clientApi = baseApiWithTag.injectEndpoints({
  endpoints: builder => ({
    postAJob: builder.mutation<{data: IJobPostInterface}, any>({
      query: body => ({
        url: apiEndPoints.jobPost,
        method: apiMethodType.post,
        body,
      }),
      invalidatesTags: ['PostedJobs'],
    }),
    getPostedJob: builder.query({
      query: () => ({
        url: apiEndPoints.getJobPost,
        method: apiMethodType.get,
      }),
      transformResponse: (
        response: IPostedJobsResponse,
      ): IJobPostCustomizedResponse => {
        let data: IJobPostTypes[] = [];
        response.data.forEach((job, index) => {
          if (job.id && job.attributes) {
            data.push({
              ...job.attributes,
              id: job.id,

              postedBy: 'posted by Yash',
              status: 0,
            });
          }
        });
        return {
          data: data,
          pagination: response?.meta && {
            page: response.meta?.pagination?.page ?? 1,
            pageSize: response?.meta.pagination?.pageSize ?? 1,
            pageCount: response?.meta.pagination?.pageCount ?? 1,
            total: response?.meta.pagination?.total ?? 1,
          },
        };
      },
      transformErrorResponse: (
        response: IErrorResponse,
      ): ICustomErrorResponse => {
        return {
          statusCode: response.status,
          message: response.data.error?.message ?? STRINGS.someting_went_wrong,
        };
      },
      providesTags: ['PostedJobs'],
    }),
    saveAsDraft: builder.mutation<{data: IJobPostInterface}, any>({
      query: body => ({
        url: apiEndPoints.saveAsDraft,
        method: apiMethodType.post,
        body,
      }),
    }),
    getDrafts: builder.query({
      query: () => ({
        url: apiEndPoints.saveAsDraft,
        method: apiMethodType.get,
      }),
      transformResponse: (
        response: IPostedJobsResponse,
      ): IJobPostCustomizedResponse => {
        let data: IJobPostTypes[] = [];
        response.data.forEach((job, index) => {
          if (job.id && job.attributes) {
            data.push({
              ...job.attributes,
              id: job.id,

              postedBy: 'posted by Yash',
              status: 0,
            });
          }
        });
        return {
          data: data,
          pagination: response?.meta && {
            page: response.meta?.pagination?.page ?? 1,
            pageSize: response?.meta.pagination?.pageSize ?? 1,
            pageCount: response?.meta.pagination?.pageCount ?? 1,
            total: response?.meta.pagination?.total ?? 1,
          },
        };
      },
    }),
  }),
});

export const {
  usePostAJobMutation,
  useLazyGetPostedJobQuery,
  useSaveAsDraftMutation,
  useLazyGetDraftsQuery,
} = clientApi;
